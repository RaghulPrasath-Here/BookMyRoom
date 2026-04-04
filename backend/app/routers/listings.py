from fastapi import APIRouter, HTTPException, Request, Depends
from app.models import ListingCreate, ParseRequest
from app.config import supabase
from app.services.parser import parse_listing as ai_parse
from app.services.embeddings import generate_embedding
from app.limiter import limiter
from app.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/listings", tags=["listings"])


@router.post("/parse")
@limiter.limit("10/minute")
async def parse_listing(request: Request, body: ParseRequest):
    if not body.raw_text.strip():
        raise HTTPException(status_code=400, detail="raw_text cannot be empty")
    result = ai_parse(body.raw_text)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"raw_text": body.raw_text, "parsed": result["data"]}


@router.post("/")
@limiter.limit("20/minute")
async def create_listing(
    request: Request,
    listing: ListingCreate,
    current_user=Depends(get_current_user)
):
    try:
        listing_dict = listing.model_dump()

        # Attach the logged in user's ID
        listing_dict["user_id"] = current_user.id

        # Generate embedding
        embedding = generate_embedding(listing_dict)
        listing_dict["embedding"] = embedding

        if listing_dict.get("available_from"):
            listing_dict["available_from"] = str(listing_dict["available_from"])

        result = supabase.table("listings").insert(listing_dict).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save listing")

        return result.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_listings(
    request: Request,
    skip: int = 0,
    limit: int = 50,
    dublin_area: str = None,
    max_price: float = None,
):
    try:
        query = supabase.table("listings")\
            .select("id, title, price, bills_included, location, dublin_area, available_from, room_type, gender_preference, is_permanent, duration_months, contact, created_at, photos")\
            .eq("is_active", True)\
            .gt("expires_at", "now()")\
            .order("created_at", desc=True)

        if dublin_area:
            query = query.eq("dublin_area", dublin_area)
        if max_price:
            query = query.lte("price", max_price)

        result = query.range(skip, skip + limit - 1).execute()
        return {"listings": result.data, "total": len(result.data)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my")
async def get_my_listings(
    request: Request,
    current_user=Depends(get_current_user)
):
    """Returns all listings created by the logged in user"""
    try:
        result = supabase.table("listings")\
            .select("*")\
            .eq("user_id", current_user.id)\
            .order("created_at", desc=True)\
            .execute()
        return {"listings": result.data, "total": len(result.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{listing_id}")
async def get_listing(listing_id: str, request: Request):
    result = supabase.table("listings")\
        .select("*")\
        .eq("id", listing_id)\
        .eq("is_active", True)\
        .gt("expires_at", "now()")\
        .execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")
    return result.data[0]


@router.put("/{listing_id}")
async def update_listing(
    listing_id: str,
    request: Request,
    listing: ListingCreate,
    current_user=Depends(get_current_user)
):
    """Only the owner or admin can update a listing"""
    try:
        # Check ownership
        existing = supabase.table("listings")\
            .select("user_id")\
            .eq("id", listing_id)\
            .execute()

        if not existing.data:
            raise HTTPException(status_code=404, detail="Listing not found")

        owner_id = existing.data[0].get("user_id")
        is_admin = getattr(current_user, "user_metadata", {}).get("is_admin", False)

        if owner_id != current_user.id and not is_admin:
            raise HTTPException(status_code=403, detail="Not authorised to edit this listing")

        listing_dict = listing.model_dump()

        # Regenerate embedding with updated fields
        embedding = generate_embedding(listing_dict)
        listing_dict["embedding"] = embedding

        if listing_dict.get("available_from"):
            listing_dict["available_from"] = str(listing_dict["available_from"])

        result = supabase.table("listings")\
            .update(listing_dict)\
            .eq("id", listing_id)\
            .execute()

        return result.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{listing_id}")
async def delete_listing(
    listing_id: str,
    request: Request,
    current_user=Depends(get_current_user)
):
    """Only the owner or admin can delete a listing"""
    try:
        existing = supabase.table("listings")\
            .select("user_id")\
            .eq("id", listing_id)\
            .execute()

        if not existing.data:
            raise HTTPException(status_code=404, detail="Listing not found")

        owner_id = existing.data[0].get("user_id")
        is_admin = getattr(current_user, "user_metadata", {}).get("is_admin", False)

        if owner_id != current_user.id and not is_admin:
            raise HTTPException(status_code=403, detail="Not authorised to delete this listing")

        # Soft delete — just mark inactive
        supabase.table("listings")\
            .update({"is_active": False})\
            .eq("id", listing_id)\
            .execute()

        return {"message": "Listing deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
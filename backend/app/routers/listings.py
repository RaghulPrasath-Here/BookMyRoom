from fastapi import APIRouter, HTTPException, Request
from app.models import ListingCreate, ParseRequest
from app.config import supabase
from app.services.parser import parse_listing as ai_parse
from app.services.embeddings import generate_embedding
from app.limiter import limiter

router = APIRouter(prefix="/listings", tags=["listings"])


@router.post("/parse")
@limiter.limit("10/minute")
async def parse_listing(request: Request, body: ParseRequest):
    if not body.raw_text.strip():
        raise HTTPException(status_code=400, detail="raw_text cannot be empty")

    result = ai_parse(body.raw_text)

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "raw_text": body.raw_text,
        "parsed": result["data"]
    }


@router.post("/")
@limiter.limit("20/minute")
async def create_listing(request: Request, listing: ListingCreate):
    try:
        listing_dict = listing.model_dump()

        # Generate embedding
        embedding = generate_embedding(listing_dict)
        listing_dict["embedding"] = embedding

        # Convert date to string for Supabase
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
    limit: int = 20,
    dublin_area: str = None,
    max_price: float = None,
):
    try:
        query = supabase.table("listings")\
            .select("id, title, price, bills_included, location, dublin_area, available_from, room_type, gender_preference, is_permanent, duration_months, contact, created_at")\
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
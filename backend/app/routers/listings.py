from fastapi import APIRouter, HTTPException
from app.models import ListingCreate, ParseRequest
from app.config import supabase
from app.services.parser import parse_listing as ai_parse
from app.services.embeddings import generate_embedding

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("/parse")
def parse_listing(request: ParseRequest):
    if not request.raw_text.strip():
        raise HTTPException(status_code=400, detail="raw_text cannot be empty")

    result = ai_parse(request.raw_text)

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        "raw_text": request.raw_text,
        "parsed": result["data"]
    }

@router.post("/")
def create_listing(listing: ListingCreate):
    try:
        # Convert listing to dict
        listing_dict = listing.model_dump()

        # Generate embedding from listing fields
        embedding = generate_embedding(listing_dict)

        # Add embedding to the listing dict
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
def get_listings(
    skip: int = 0,
    limit: int = 20,
    dublin_area: str = None,
    max_price: float = None,
):
    try:
        query = supabase.table("listings")\
            .select("id, title, price, bills_included, location, dublin_area, available_from, room_type, gender_preference, is_permanent, duration_months, contact, created_at")\
            .eq("is_active", True)\
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
def get_listing(listing_id: str):
    result = supabase.table("listings")\
        .select("*")\
        .eq("id", listing_id)\
        .eq("is_active", True)\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")

    return result.data[0]
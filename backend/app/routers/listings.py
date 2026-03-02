from fastapi import APIRouter, HTTPException
from app.models import ListingCreate, ListingResponse, ParseRequest
from app.config import supabase

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("/parse")
def parse_listing(request: ParseRequest):
    return {"raw_text": request.raw_text, "parsed": {}}

@router.post("/", response_model=ListingResponse)
def create_listing(listing: ListingCreate):
    # Saving listing to Supabase + generate embedding
    # For now just returning a demo msg
    return {"message": "listing will be saved here"}

@router.get("/")
def get_listings(
    skip: int = 0,
    limit: int = 20,
    dublin_area: str = None,
    max_price: float = None,
):
    return {"listings": [], "total": 0}

@router.get("/{listing_id}")
def get_listing(listing_id: str):
    result = supabase.table("listings").select("*").eq("id", listing_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Listing not found")
    return result.data[0]
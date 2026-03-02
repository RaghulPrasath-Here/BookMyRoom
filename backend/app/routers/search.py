from fastapi import APIRouter
from app.models import SearchRequest
from app.config import supabase

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/")
def search_listings(request: SearchRequest):
    # Vector search 
    return {"results": [], "query": request.query}
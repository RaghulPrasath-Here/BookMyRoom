from fastapi import APIRouter, HTTPException
from app.models import SearchRequest
from app.services.search import search_listings as vector_search

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/")
def search(request: SearchRequest):
    try:
        results = vector_search(
            query=request.query,
            max_price=request.max_price,
            dublin_area=request.dublin_area,
            is_permanent=request.is_permanent,
            available_from=str(request.available_from) if request.available_from else None
        )
        return {
            "query": request.query,
            "total": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
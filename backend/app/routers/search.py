from fastapi import APIRouter, HTTPException, Request
from app.models import SearchRequest
from app.services.search import search_listings as vector_search
from app.limiter import limiter

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/")
@limiter.limit("30/minute")
async def search(request: Request, body: SearchRequest):
    try:
        results = vector_search(
            query=body.query,
            max_price=body.max_price,
            dublin_area=body.dublin_area,
            is_permanent=body.is_permanent,
            available_from=str(body.available_from) if body.available_from else None
        )
        return {
            "query": body.query,
            "total": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from openai import OpenAI
from app.config import OPENAI_API_KEY, supabase

client = OpenAI(api_key=OPENAI_API_KEY)

def embed_query(query: str) -> list:
    """Convert search query into embedding vector"""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return response.data[0].embedding

def search_listings(
    query: str,
    max_price: float = None,
    dublin_area: str = None,
    is_permanent: bool = None,
    available_from: str = None,
    limit: int = 10
) -> list:

    query_embedding = embed_query(query)

    # Building the pgvector similarity search query
    result = supabase.rpc(
        "search_listings",
        {
            "query_embedding": query_embedding,
            "match_threshold": 0.3,  # minimum similarity score
            "match_count": 50        
        }
    ).execute()

    if not result.data:
        return []

    listings = result.data

    # Applying filters on top of vector results
    if max_price is not None:
        listings = [l for l in listings if l.get("price") and l["price"] <= max_price]

    if dublin_area is not None:
        listings = [l for l in listings if l.get("dublin_area") and
                   dublin_area.lower() in l["dublin_area"].lower()]

    if is_permanent is not None:
        listings = [l for l in listings if l.get("is_permanent") == is_permanent]

    return listings[:limit]
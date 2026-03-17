from openai import OpenAI
from app.config import OPENAI_API_KEY, supabase
import json

client = OpenAI(api_key=OPENAI_API_KEY)

def embed_query(query: str) -> list:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return response.data[0].embedding

def extract_filters_from_query(query: str) -> dict:
    
    # Use GPT to extract hard filters from natural language query.
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """Extract search filters from a Dublin accommodation query.
Return ONLY a valid JSON object with these fields (use null if not mentioned):
{
  "dublin_area": "area name or null",
  "max_price": number or null,
  "is_permanent": true/false or null,
  "gender_preference": "male"/"female"/"couple"/"any" or null
}

Dublin area examples: Rialto, Rathmines, Dublin 1, Dublin 12, Citywest, Tallaght, Sandyford
If query says "temp" or "temporary" -> is_permanent: false
If query says "permanent" -> is_permanent: true
Return ONLY the JSON, nothing else."""
            },
            {
                "role": "user",
                "content": query
            }
        ],
        temperature=0,
        max_tokens=100
    )
    try:
        return json.loads(response.choices[0].message.content.strip())
    except Exception:
        return {}

def search_listings(
    query: str,
    max_price: float = None,
    dublin_area: str = None,
    is_permanent: bool = None,
    available_from: str = None,
    limit: int = 10
) -> list:

    # Embeddingthe search query
    query_embedding = embed_query(query)

    # Extracting filters from natural language
    ai_filters = extract_filters_from_query(query)

    # Merge AI-extracted filters with any explicit filters passed in
    # Explicit filters take priority over AI-extracted ones
    final_area = dublin_area or ai_filters.get("dublin_area")
    final_max_price = max_price or ai_filters.get("max_price")
    final_is_permanent = is_permanent if is_permanent is not None else ai_filters.get("is_permanent")
    final_gender = ai_filters.get("gender_preference")

    # Vector similarity search
    result = supabase.rpc(
        "search_listings",
        {
            "query_embedding": query_embedding,
            "match_threshold": 0.3,
            "match_count": 50
        }
    ).execute()

    if not result.data:
        return []

    listings = result.data

    # Applying hard filters on top
    if final_max_price is not None:
        listings = [l for l in listings if l.get("price") and l["price"] <= final_max_price]

    if final_area is not None:
        listings = [l for l in listings if l.get("dublin_area") and
                   final_area.lower() in l["dublin_area"].lower() or
                   l.get("location") and final_area.lower() in l["location"].lower()]

    if final_is_permanent is not None:
        listings = [l for l in listings if l.get("is_permanent") == final_is_permanent]

    if final_gender and final_gender != "any":
        listings = [l for l in listings if l.get("gender_preference") == final_gender
                   or l.get("gender_preference") == "any"]

    return listings[:limit]

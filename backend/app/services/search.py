import re
import json
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


def extract_filters_from_query(query: str) -> dict:

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """Extract search filters from a Dublin accommodation query.
Return ONLY a valid JSON object with these fields (use null if not mentioned):
{
  "dublin_area": "exact Dublin area name or null",
  "landmark": "nearby landmark, venue, college, hospital, Luas stop or null",
  "max_price": number or null,
  "is_permanent": true/false or null,
  "gender_preference": "male"/"female"/"couple"/"any" or null
}

Dublin area examples: Rialto, Rathmines, Dublin 1, Dublin 2, Dublin 4, Dublin 7,
Dublin 8, Dublin 9, Dublin 12, Dublin 15, Citywest, Tallaght, Swords, Sandyford,
Dun Laoghaire, Clondalkin, Ranelagh

Landmark examples: 3Arena, UCD, NCI, TCD, DCU, Griffith College,
St James Hospital, Tallaght Hospital, Connolly Station, Heuston Station,
Bluebell Luas, Citywest Luas, Sandyford Luas, IFSC, Grand Canal Dock

Rules:
- If query mentions "temp", "temporary", "short term" -> is_permanent: false
- If query mentions "permanent", "long term" -> is_permanent: true
- If query mentions a specific area like "Dublin 1" extract it exactly as "Dublin 1"
- If query mentions a landmark like "near 3arena" extract it as landmark not dublin_area
- Return ONLY the JSON object, nothing else"""
            },
            {
                "role": "user",
                "content": query
            }
        ],
        temperature=0,
        max_tokens=150
    )
    try:
        return json.loads(response.choices[0].message.content.strip())
    except Exception:
        return {}


def area_matches(text: str, area: str) -> bool:

    if not text or not area:
        return False
    pattern = re.compile(r'\b' + re.escape(area) + r'\b', re.IGNORECASE)
    return bool(pattern.search(text))


def landmark_matches(listing: dict, landmark: str) -> bool:

    if not landmark:
        return False

    fields_to_check = [
        listing.get("location") or "",
        listing.get("dublin_area") or "",
    ]

    for place in listing.get("nearby_places") or []:
        fields_to_check.append(place)

    for link in listing.get("transport_links") or []:
        fields_to_check.append(link)

    return any(landmark.lower() in field.lower() for field in fields_to_check)


def search_listings(
    query: str,
    max_price: float = None,
    dublin_area: str = None,
    is_permanent: bool = None,
    available_from: str = None,
    limit: int = 10
) -> list:

    # Embed the search query
    query_embedding = embed_query(query)

    # Extract filters from natural language
    ai_filters = extract_filters_from_query(query)
    print(f"AI extracted filters: {ai_filters}")  # helpful for debugging

    # Merge AI-extracted filters with any explicit filters passed in
    # Explicit filters (from URL params) take priority over AI-extracted ones
    final_area = dublin_area or ai_filters.get("dublin_area")
    final_max_price = max_price or ai_filters.get("max_price")
    final_is_permanent = is_permanent if is_permanent is not None else ai_filters.get("is_permanent")
    final_gender = ai_filters.get("gender_preference")
    final_landmark = ai_filters.get("landmark")

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

    # Apply hard filters on top of vector results

    if final_max_price is not None:
        listings = [
            l for l in listings
            if l.get("price") and l["price"] <= final_max_price
        ]

    if final_area is not None:
        listings = [
            l for l in listings
            if (
                area_matches(l.get("dublin_area"), final_area)
                or area_matches(l.get("location"), final_area)
            )
        ]

    if final_landmark is not None:
        listings = [
            l for l in listings
            if landmark_matches(l, final_landmark)
        ]

    if final_is_permanent is not None:
        listings = [
            l for l in listings
            if l.get("is_permanent") == final_is_permanent
        ]

    if final_gender and final_gender != "any":
        listings = [
            l for l in listings
            if (
                l.get("gender_preference") == final_gender
                or l.get("gender_preference") == "any"
            )
        ]

    return listings[:limit]
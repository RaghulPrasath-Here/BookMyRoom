import re
import json
from openai import OpenAI
from app.config import OPENAI_API_KEY, supabase

client = OpenAI(api_key=OPENAI_API_KEY)

# Maps natural language phrases to actual Dublin area names in the DB
AREA_SYNONYMS = {
    # City centre
    "city centre":      ["Dublin 1", "Dublin 2"],
    "city center":      ["Dublin 1", "Dublin 2"],
    "city":             ["Dublin 1", "Dublin 2"],
    "town":             ["Dublin 1", "Dublin 2"],
    "town centre":      ["Dublin 1", "Dublin 2"],
    "centre":           ["Dublin 1", "Dublin 2"],
    "center":           ["Dublin 1", "Dublin 2"],
    "docklands":        ["Dublin 1", "Dublin 2"],
    "ifsc":             ["Dublin 1"],
    "spire":            ["Dublin 1"],
    "o'connell street": ["Dublin 1"],

    # South side
    "southside":        ["Dublin 4", "Dublin 6", "Rathmines", "Ranelagh", "Sandyford"],
    "south dublin":     ["Dublin 4", "Dublin 6", "Rathmines", "Ranelagh"],
    "ballsbridge":      ["Dublin 4"],
    "donnybrook":       ["Dublin 4"],
    "merrion":          ["Dublin 4"],
    "sandymount":       ["Dublin 4"],

    # North side
    "northside":        ["Dublin 7", "Dublin 9"],
    "north dublin":     ["Dublin 7", "Dublin 9"],
    "phibsboro":        ["Dublin 7"],
    "stoneybatter":     ["Dublin 7"],
    "drumcondra":       ["Dublin 9"],
    "glasnevin":        ["Dublin 9"],

    # West
    "west dublin":      ["Dublin 15", "Clondalkin", "Citywest", "Tallaght"],

    # Landmark - area
    "near ucd":         ["Dublin 4", "Ranelagh"],
    "near nci":         ["Dublin 1"],
    "near tcd":         ["Dublin 2"],
    "near trinity":     ["Dublin 2"],
    "near dcu":         ["Dublin 9"],
    "near connolly":    ["Dublin 1"],
    "near heuston":     ["Dublin 8"],
    "near st james":    ["Dublin 8"],
    "near mater":       ["Dublin 7"],
}

# AREAS CONSIDERED FAR FROM CITY CENTRE
FAR_FROM_CITY_CENTRE = [
    "Citywest", "Tallaght", "Swords", "Clondalkin",
    "Blanchardstown", "Dublin 15", "Sandyford",
    "Dún Laoghaire", "Dun Laoghaire"
]

# PRICE HINTS — map vague language to max price
PRICE_HINTS = {
    "cheap":      600,
    "affordable": 700,
    "budget":     650,
    "low budget": 550,
    "reasonable": 750,
}


def embed_query(query: str) -> list:
    """Convert search query into embedding vector"""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    return response.data[0].embedding


def resolve_area_synonyms(area: str) -> list:
    """
    Convert a natural language area like 'city centre'
    into a list of actual Dublin area names from the DB.
    """
    if not area:
        return []

    area_lower = area.lower().strip()

    # Check synonym map first
    for key, values in AREA_SYNONYMS.items():
        if key in area_lower or area_lower in key:
            return values

    return [area]


def infer_price_from_language(query: str) -> int | None:
    """Check if query contains vague price language and return a max price"""
    query_lower = query.lower()
    for hint, price in PRICE_HINTS.items():
        if hint in query_lower:
            return price
    return None


def extract_filters_from_query(query: str) -> dict:
    """
    Use GPT to extract hard filters from natural language query.
    Returns structured filters including area, landmark, price, etc.
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """You are a Dublin accommodation search assistant.
Extract search filters from the user's query.

IMPORTANT DUBLIN GEOGRAPHY — know these facts:
- "city centre" / "city center" / "town" / "centre" = Dublin 1 or Dublin 2
- "southside" = Dublin 4, Dublin 6, Rathmines, Ranelagh
- "northside" = Dublin 7, Dublin 9
- "near UCD" or "Belfield" = Dublin 4
- "near NCI" or "near Connolly Station" = Dublin 1
- "near TCD" or "near Trinity" = Dublin 2
- "near DCU" = Dublin 9
- "near St James Hospital" or "near Heuston" = Dublin 8
- Citywest, Tallaght, Swords, Blanchardstown are SUBURBS — NOT city centre
- "affordable" / "cheap" / "budget" = max price around €600-650
- "temp" / "temporary" / "short term" / "short stay" = is_permanent: false
- "long term" / "permanent" = is_permanent: true

Return ONLY a valid JSON object with these fields (null if not mentioned):
{
  "dublin_area": "exact area name as it would appear in listings, or null",
  "landmark": "specific landmark, college, hospital, Luas stop or null",
  "max_price": number or null,
  "is_permanent": true/false or null,
  "gender_preference": "male/female/couple/any or null",
  "is_city_centre": true if user wants city centre / central location, false otherwise
}

Examples:
- "room in city centre" → dublin_area: "city centre", is_city_centre: true
- "near UCD" → dublin_area: "Dublin 4", landmark: "UCD"
- "cheap room for female" → max_price: 650, gender_preference: "female"
- "temp room 3 months" → is_permanent: false
- "place near Luas" → landmark: "Luas"

Return ONLY the JSON, nothing else."""
            },
            {
                "role": "user",
                "content": query
            }
        ],
        temperature=0,
        max_tokens=200
    )
    try:
        return json.loads(response.choices[0].message.content.strip())
    except Exception:
        return {}


def area_matches(text: str, area: str) -> bool:
    """Word boundary match — prevents Dublin 1 matching Dublin 12"""
    if not text or not area:
        return False
    pattern = re.compile(r'\b' + re.escape(area) + r'\b', re.IGNORECASE)
    return bool(pattern.search(text))


def listing_matches_any_area(listing: dict, areas: list) -> bool:
    """Check if a listing matches any area in the list"""
    for area in areas:
        if (area_matches(listing.get("dublin_area", ""), area) or
                area_matches(listing.get("location", ""), area)):
            return True
    return False


def landmark_matches(listing: dict, landmark: str) -> bool:
    """Check if a landmark appears in listing's nearby places, transport or location"""
    if not landmark:
        return False

    fields = [
        listing.get("location") or "",
        listing.get("dublin_area") or "",
    ]
    for place in listing.get("nearby_places") or []:
        fields.append(place)
    for link in listing.get("transport_links") or []:
        fields.append(link)

    return any(landmark.lower() in field.lower() for field in fields)


def boost_and_sort(listings: list, final_areas: list) -> list:
    """
    Give a similarity score bonus to listings that exactly match
    the requested area, then re-sort.
    """
    for listing in listings:
        base_score = listing.get("similarity", 0)
        if final_areas:
            for area in final_areas:
                if area_matches(listing.get("dublin_area", ""), area):
                    listing["similarity"] = min(base_score + 0.1, 1.0)
                    break

    listings.sort(key=lambda x: x.get("similarity", 0), reverse=True)
    return listings


def search_listings(
    query: str,
    max_price: float = None,
    dublin_area: str = None,
    is_permanent: bool = None,
    available_from: str = None,
    limit: int = 10
) -> list:
    """
    Full search pipeline:
    1. Embed the query
    2. Extract structured filters via GPT
    3. Resolve area synonyms (city centre → Dublin 1, Dublin 2)
    4. Vector similarity search via pgvector
    5. Apply hard filters
    6. Exclude suburbs if city centre was requested
    7. Boost exact area matches and re-sort
    8. Return top results
    """

    # Embed query
    query_embedding = embed_query(query)

    # Extract filters from natural language
    ai_filters = extract_filters_from_query(query)
    print(f"AI extracted filters: {ai_filters}")

    # Resolve final filter values
    # Explicit filters passed in take priority over AI-extracted ones
    raw_area = dublin_area or ai_filters.get("dublin_area")
    final_areas = resolve_area_synonyms(raw_area) if raw_area else []

    # Price 
    final_max_price = (
        max_price or
        ai_filters.get("max_price") or
        infer_price_from_language(query)
    )

    final_is_permanent = (
        is_permanent if is_permanent is not None
        else ai_filters.get("is_permanent")
    )

    final_gender = ai_filters.get("gender_preference")
    final_landmark = ai_filters.get("landmark")
    is_city_centre = ai_filters.get("is_city_centre", False)

    # Vector similarity search
    result = supabase.rpc(
        "search_listings",
        {
            "query_embedding": query_embedding,
            "match_threshold": 0.4,  # raised from 0.3 for better precision
            "match_count": 50
        }
    ).execute()

    if not result.data:
        return []

    listings = result.data

    # Apply hard filters

    # Price filter
    if final_max_price is not None:
        listings = [
            l for l in listings
            if l.get("price") and l["price"] <= final_max_price
        ]

    # Area filter — match against all resolved areas
    if final_areas:
        listings = [
            l for l in listings
            if listing_matches_any_area(l, final_areas)
        ]

    # Landmark filter
    if final_landmark:
        listings = [
            l for l in listings
            if landmark_matches(l, final_landmark)
        ]

    # Permanent/temporary filter
    if final_is_permanent is not None:
        listings = [
            l for l in listings
            if l.get("is_permanent") == final_is_permanent
        ]

    # Gender filter
    if final_gender and final_gender != "any":
        listings = [
            l for l in listings
            if (
                l.get("gender_preference") == final_gender
                or l.get("gender_preference") == "any"
            )
        ]

    # Exclude suburbs if city centre was requested
    if is_city_centre:
        city_centre_filtered = [
            l for l in listings
            if l.get("dublin_area") not in FAR_FROM_CITY_CENTRE
        ]
        # Only apply exclusion if it doesn't empty the results
        if city_centre_filtered:
            listings = city_centre_filtered

    # Boost exact area matches and re-sort
    if final_areas:
        listings = boost_and_sort(listings, final_areas)

    return listings[:limit]
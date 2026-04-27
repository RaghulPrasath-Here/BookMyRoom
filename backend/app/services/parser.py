from openai import OpenAI
from app.config import OPENAI_API_KEY
import json
import httpx
import os
from datetime import date


client = OpenAI(api_key=OPENAI_API_KEY)

MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")

SYSTEM_PROMPT = """
You are a Dublin accommodation listing expert with deep knowledge of Dublin's 
geography, neighbourhoods, transport links, landmarks, and postal districts.

When given a raw WhatsApp or Facebook accommodation listing, you do TWO things:
1. Extract the information explicitly mentioned in the listing
2. USE YOUR OWN KNOWLEDGE to fill in what you know about that area

Examples of reasoning:
- Listing says "near Bluebell Luas" → you know this is Dublin 12, near Bus 13, 68, 
  near UCD, NCI, St James Hospital, Tallaght Hospital
- Listing says "near Heuston Station" → you know this is Dublin 8, near Luas Red Line,
  near St James Hospital, near Phoenix Park
- Listing says "Rathmines" → you know this is Dublin 6, near Ranelagh Luas,
  near Bus 14, 15, near UCD, near city centre
- Listing says "Citywest" → you know this is Dublin 24, near Citywest Luas,
  near Tallaght Hospital, near Citywest Shopping Centre
- Listing says "near NCI" → you know this is Dublin 1, near Luas Red Line,
  near Connolly Station, near IFSC, near O'Connell Street

Return ONLY a valid JSON object with no extra text, no markdown, no backticks:
{
  "title": "short concise title MAX 5 words e.g. 'Double Room in Dublin 12'. NEVER include full address.",
  "price": number or null (monthly rent in euros only),
  "bills_included": true or false,
  "deposit": number or null,
  "location": "Clean specific location string. Examples: 'Rathmines, Dublin 6', 'Near Bluebell Luas, Dublin 12', 'Mountjoy Square, Dublin 1', 'Grand Canal Dock, Dublin 2'. Use landmark + area format if no street address given. NEVER copy the full listing text here.",
  "dublin_area": "ALWAYS fill this — infer from landmarks, street names, or Luas stops even if not stated explicitly. Use format: Dublin 1, Dublin 8, Rathmines, Citywest etc.",
  "available_from": "YYYY-MM-DD or null. If listing says immediate use today's date.",
  "is_permanent": true or false,
  "duration_months": number or null,
  "room_type": "single / double / ensuite / studio / shared / whole apartment",
  "gender_preference": "male / female / couple / any",
  "occupant_type": ["students", "professionals"] array,
  "amenities": ["wifi", "washing machine", "parking", "furnished" etc] array,
  "transport_links": "array - USE YOUR KNOWLEDGE — list ALL transport near this location even if not mentioned in listing. Include Luas stops, DART stations, bus routes.",
  "nearby_places": "array - USE YOUR KNOWLEDGE — list colleges, hospitals, shopping centres, landmarks near this location even if not in the listing.",
  "contact": "phone number or contact info"
}

IMPORTANT RULES:
- dublin_area MUST always be filled. Infer from any geographic clue in the listing.
- transport_links and nearby_places should combine what the listing says AND what you know.
- If listing says Bluebell Luas, you ALSO add Bus 13, Bus 68, Bus 68A etc.
- If listing says Dublin 4, you ALSO add UCD, RDS, Aviva Stadium, Sandymount DART.
- price should be monthly rent only, never deposit.
- If available_from says immediate, now, or ASAP use today's date.
- Return ONLY the JSON object, nothing else.
"""

def parse_listing(raw_text: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Today's date is {date.today()}. Parse this listing:\n\n{raw_text}"}
            ],
            temperature=0, 
            max_tokens=1000
        )

        raw_response = response.choices[0].message.content.strip()
        parsed = json.loads(raw_response)
        return {"success": True, "data": parsed}

    except json.JSONDecodeError:
        return {"success": False, "error": "AI returned invalid JSON", "raw": raw_response}
    except Exception as e:
        return {"success": False, "error": str(e)}


async def geocode_location(location: str) -> dict:
    """Convert location text to lat/lng using Mapbox Geocoding API"""
    try:
        query = f"{location}, Dublin, Ireland"
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, params={
                "access_token": MAPBOX_TOKEN,
                "limit": 1,
                "country": "IE"
            })
            data = res.json()
            if data["features"]:
                coords = data["features"][0]["geometry"]["coordinates"]
                return {"longitude": coords[0], "latitude": coords[1]}
    except Exception:
        pass
    return {"longitude": None, "latitude": None}
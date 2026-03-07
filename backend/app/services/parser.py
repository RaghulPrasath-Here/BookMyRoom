from openai import OpenAI
from app.config import OPENAI_API_KEY
import json

client = OpenAI(api_key=OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are an expert at extracting structured information from informal 
Dublin accommodation listings posted on WhatsApp and Facebook groups.

Extract the following fields from the listing text and return ONLY 
a valid JSON object with no extra text, no markdown, no backticks.

Fields to extract:
{
  "title": "short descriptive title e.g. Double Room in Dublin 12",
  "price": number or null (monthly rent in euros, numbers only),
  "bills_included": true or false,
  "deposit": number or null,
  "location": "full location description",
  "dublin_area": "e.g. Dublin 1, Dublin 12, Rathmines, Citywest etc",
  "available_from": "YYYY-MM-DD or null if immediate use today's date",
  "is_permanent": true or false,
  "duration_months": number or null (only if temporary),
  "room_type": "single / double / ensuite / studio / shared / whole apartment",
  "gender_preference": "male / female / couple / any",
  "occupant_type": ["students", "professionals"] (array, include both if mentioned),
  "amenities": ["wifi", "washing machine", "balcony", "furnished", "parking" etc],
  "transport_links": ["Bluebell Luas", "Bus 13", "Bus 68A" etc],
  "nearby_places": ["UCD", "NCI", "St James Hospital", "Tallaght Hospital" etc],
  "contact": "phone number or contact info"
}

Rules:
- If a field is not mentioned, use null for strings/numbers and [] for arrays
- For available_from, if listing says "immediate" or "now", use today's date
- For bills_included, if listing says "excluding bills" set false, "including bills" set true
- Extract ALL bus routes and Luas stops mentioned into transport_links
- Extract ALL nearby colleges, hospitals, shopping centres into nearby_places
- price should be the monthly rent only, not deposit
- Return ONLY the JSON object, nothing else
"""

def parse_listing(raw_text: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Parse this listing:\n\n{raw_text}"}
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
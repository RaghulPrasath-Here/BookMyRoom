from openai import OpenAI
from app.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_embedding(listing: dict) -> list:
    """
    Combines important listing fields into one sentence
    and converts it into a 1536-dimensional vector
    """
    
    parts = []

    if listing.get("title"):
        parts.append(listing["title"])

    if listing.get("room_type"):
        parts.append(f"{listing['room_type']} room")

    if listing.get("location"):
        parts.append(f"in {listing['location']}")

    if listing.get("dublin_area"):
        parts.append(f"area: {listing['dublin_area']}")

    if listing.get("price"):
        bills = "bills included" if listing.get("bills_included") else "bills not included"
        parts.append(f"€{listing['price']} per month {bills}")

    if listing.get("gender_preference"):
        parts.append(f"for {listing['gender_preference']}")

    if listing.get("occupant_type"):
        parts.append(f"suitable for {', '.join(listing['occupant_type'])}")

    if listing.get("is_permanent") is False and listing.get("duration_months"):
        parts.append(f"temporary {listing['duration_months']} months")
    elif listing.get("is_permanent"):
        parts.append("permanent")

    if listing.get("transport_links"):
        parts.append(f"near {', '.join(listing['transport_links'])}")

    if listing.get("nearby_places"):
        parts.append(f"close to {', '.join(listing['nearby_places'])}")

    if listing.get("amenities"):
        parts.append(f"amenities: {', '.join(listing['amenities'])}")

    # Join everything into one sentence
    text = ". ".join(parts)
    print(f"Embedding text: {text}")  # debugging

    # Sending to OpenAI and getting back 1536 numbers
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )

    return response.data[0].embedding
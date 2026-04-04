from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class ListingCreate(BaseModel):
    raw_text: str
    title: Optional[str] = None
    price: Optional[float] = None
    bills_included: Optional[bool] = False
    deposit: Optional[float] = None
    location: Optional[str] = None
    dublin_area: Optional[str] = None
    available_from: Optional[date] = None
    is_permanent: Optional[bool] = True
    duration_months: Optional[float] = None
    room_type: Optional[str] = None
    gender_preference: Optional[str] = None
    occupant_type: Optional[List[str]] = []
    amenities: Optional[List[str]] = []
    transport_links: Optional[List[str]] = []
    nearby_places: Optional[List[str]] = []
    contact: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photos: Optional[List[str]] = []
    user_id: Optional[str] = None 

class ListingResponse(ListingCreate):
    id: str
    is_active: bool
    created_at: datetime
    expires_at: datetime

class ParseRequest(BaseModel):
    raw_text: str

class SearchRequest(BaseModel):
    query: str
    max_price: Optional[float] = None
    dublin_area: Optional[str] = None
    is_permanent: Optional[bool] = None
    available_from: Optional[date] = None
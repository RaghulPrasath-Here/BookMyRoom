from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import listings, search
from app.config import supabase

app = FastAPI(title="BookMyRoom API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(listings.router)
app.include_router(search.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "BookMyRoom API is running"}

@app.get("/test-db")
def test_db():
    result = supabase.table("listings").select("id").limit(1).execute()
    return {"status": "connected", "data": result.data}
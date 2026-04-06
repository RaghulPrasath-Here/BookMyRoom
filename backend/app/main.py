from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.routers import listings, search, auth, photos
from app.config import supabase
from app.limiter import limiter

app = FastAPI(title="BookMyRoom API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://book-my-room-psi.vercel.app",
        "https://*.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(listings.router)
app.include_router(search.router)
app.include_router(auth.router)
app.include_router(photos.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "BookMyRoom API is running"}

@app.get("/test-db")
def test_db():
    result = supabase.table("listings").select("id").limit(1).execute()
    return {"status": "connected", "data": result.data}
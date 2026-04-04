from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import supabase

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Extracts and verifies the JWT token from the Authorization header
    """
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Security(HTTPBearer(auto_error=False))
):
    """
    Used for endpoints that work for both logged in and anonymous users
    """
    if not credentials:
        return None
    try:
        user = supabase.auth.get_user(credentials.credentials)
        return user.user if user else None
    except Exception:
        return None
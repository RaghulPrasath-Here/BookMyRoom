from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import supabase

router = APIRouter(prefix="/auth", tags=["auth"])


class SignUpRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(body: SignUpRequest):
    try:
        result = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password
        })
        if not result.user:
            raise HTTPException(status_code=400, detail="Signup failed")
        return {
            "message": "Account created successfully. Please check your email to verify.",
            "user": {"id": result.user.id, "email": result.user.email}
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(body: LoginRequest):
    try:
        result = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password
        })
        if not result.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {
            "access_token": result.session.access_token,
            "user": {"id": result.user.id, "email": result.user.email}
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/logout")
async def logout():
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
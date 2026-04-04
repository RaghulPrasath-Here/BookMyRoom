from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Request
from app.config import supabase
from app.auth import get_current_user
from app.limiter import limiter
import uuid

router = APIRouter(prefix="/photos", tags=["photos"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/upload")
@limiter.limit("20/minute")
async def upload_photo(
    request: Request,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    """Upload a photo to Supabase Storage, returns the public URL"""
    try:
        # Validate file type
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Only JPEG, PNG and WebP images are allowed"
            )

        # Read file content
        content = await file.read()

        # Validate file size
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size must be under 5MB"
            )

        # Generate unique filename — user_id/uuid.ext
        ext = file.filename.split(".")[-1].lower()
        filename = f"{current_user.id}/{uuid.uuid4()}.{ext}"

        # Upload to Supabase Storage
        result = supabase.storage\
            .from_("listing-photos")\
            .upload(filename, content, {"content-type": file.content_type})

        # Get the public URL
        public_url = supabase.storage\
            .from_("listing-photos")\
            .get_public_url(filename)

        return {"url": public_url, "filename": filename}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete")
async def delete_photo(
    filename: str,
    current_user=Depends(get_current_user)
):
    """Delete a photo from Supabase Storage"""
    try:
        # Security check — only allow deleting own photos
        if not filename.startswith(current_user.id):
            raise HTTPException(
                status_code=403,
                detail="Not authorised to delete this photo"
            )

        supabase.storage\
            .from_("listing-photos")\
            .remove([filename])

        return {"message": "Photo deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
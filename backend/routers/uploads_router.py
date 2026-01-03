from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks, HTTPException, status
from typing import Any
from services import supabase_service
from services.auth import get_current_user
from models.files import UploadCreateResponse, UploadRecord
import aiofiles
import os
import uuid

router = APIRouter(prefix="/api", tags=["uploads"])


@router.post("/upload", response_model=UploadCreateResponse)
async def upload_file(file: UploadFile = File(...), user=Depends(get_current_user)):
    # user is dict with at least 'id'
    user_id = user["id"]
    contents = await file.read()

    try:
        res = await supabase_service.upload_file_bytes(user_id, file.filename, contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # Create DB record
    try:
        record = await supabase_service.insert_upload_record(
            user_id=user_id,
            filename=file.filename,
            storage_path=res["storage_path"],
            bucket=res["bucket"],
            size=len(contents),
            mime=file.content_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    return {"success": True, "upload": record, "message": "Uploaded and saved"}


@router.get("/uploads")
async def list_uploads(user=Depends(get_current_user)):
    user_id = user["id"]
    res = supabase_service.supabase.table("uploads").select(
        "*").eq("user_id", user_id).order("created_at", desc=True).execute()
    if res.error:
        raise HTTPException(status_code=500, detail=str(res.error))
    return {"uploads": res.data}

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
DEFAULT_BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "datasets")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_KEY must be set in environment")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


async def upload_file_bytes(user_id: str, filename: str, data: bytes, bucket: Optional[str] = None) -> Dict[str, Any]:
    bucket = bucket or DEFAULT_BUCKET
    # generate storage path user_id/uuid_filename
    file_id = str(uuid.uuid4())
    dest_path = f"{user_id}/{file_id}_{filename}"

    # Upload the file
    res = supabase.storage.from_(bucket).upload(dest_path, data)

    # upload returns either {'Key': ...} or error; normalize
    if res and isinstance(res, dict) and res.get('error'):
        raise RuntimeError(f"Supabase storage upload failed: {res['error']}")

    # Generate public / signed URL (we'll use signed URL for secure access)
    # expires in 1 hour by default (adjust as needed)
    signed = supabase.storage.from_(
        bucket).create_signed_url(dest_path, 60 * 60)

    return {
        "bucket": bucket,
        "storage_path": dest_path,
        "file_id": file_id,
        "signed_url": signed.get('signedURL') if signed else None,
    }


async def insert_upload_record(user_id: str, filename: str, storage_path: str, bucket: str, size: int, mime: Optional[str]) -> Dict[str, Any]:
    payload = {
        "user_id": user_id,
        "file_name": filename,
        "storage_path": storage_path,
        "bucket": bucket,
        "size": size,
        "mime": mime,
    }
    result = supabase.table("uploads").insert(payload).select("*").execute()
    if result.error:
        raise RuntimeError(f"Insert uploads failed: {result.error}")
    return result.data[0]


async def create_verification_record(user_id: str, upload_id: str) -> Dict[str, Any]:
    payload = {
        "user_id": user_id,
        "upload_id": upload_id,
        "status": "queued",
    }
    result = supabase.table("verifications").insert(
        payload).select("*").execute()
    if result.error:
        raise RuntimeError(f"Insert verification failed: {result.error}")
    return result.data[0]


async def update_verification(verification_id: str, fields: Dict[str, Any]) -> Dict[str, Any]:
    result = supabase.table("verifications").update(
        fields).eq("id", verification_id).select("*").execute()
    if result.error:
        raise RuntimeError(f"Update verification failed: {result.error}")
    return result.data[0]


async def get_verification_by_id(verification_id: str) -> Optional[Dict[str, Any]]:
    res = supabase.table("verifications").select(
        "*").eq("id", verification_id).maybe_single().execute()
    if res.error:
        raise RuntimeError(f"Query verification failed: {res.error}")
    return res.data


async def list_verifications_for_user(user_id: str) -> list:
    res = supabase.table("verifications").select(
        "*").eq("user_id", user_id).order("created_at", desc=True).execute()
    if res.error:
        raise RuntimeError(f"List verifications failed: {res.error}")
    return res.data


async def get_upload_by_id(upload_id: str) -> Optional[Dict[str, Any]]:
    res = supabase.table("uploads").select(
        "*").eq("id", upload_id).maybe_single().execute()
    if res.error:
        raise RuntimeError(f"Query upload failed: {res.error}")
    return res.data


async def download_file_to_temp(bucket: str, storage_path: str, dest_path: str) -> None:
    # download returns bytes
    res = supabase.storage.from_(bucket).download(storage_path)
    if res and isinstance(res, dict) and res.get('error'):
        raise RuntimeError(f"Supabase storage download failed: {res['error']}")
    with open(dest_path, "wb") as f:
        f.write(res)


async def get_profile_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """Return profile row for given user id (or None)."""
    res = supabase.table("profiles").select(
        "*").eq("id", user_id).maybe_single().execute()
    if res.error:
        raise RuntimeError(f"Query profiles failed: {res.error}")
    return res.data


async def get_user_role(user_id: str) -> Optional[str]:
    """Return role string for a user id, or None if not found."""
    profile = await get_profile_by_id(user_id)
    if not profile:
        return None
    return profile.get("role")


async def is_user_admin(user_id: str) -> bool:
    role = await get_user_role(user_id)
    return role == 'admin'

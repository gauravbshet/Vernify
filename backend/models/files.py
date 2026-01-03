from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class UploadRecord(BaseModel):
    id: str
    user_id: str
    file_name: str
    storage_path: str
    bucket: str
    size: int
    mime: Optional[str]
    status: str
    created_at: Optional[datetime]


class UploadCreateResponse(BaseModel):
    success: bool
    upload: Optional[UploadRecord]
    message: Optional[str]


class UploadListResponse(BaseModel):
    uploads: list[UploadRecord]


class VerificationRecord(BaseModel):
    id: str
    upload_id: str
    user_id: str
    score: Optional[float]
    scaled_score: Optional[int]
    status: str
    report: Optional[Dict[str, Any]]
    details: Optional[Dict[str, Any]]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    created_at: Optional[datetime]


class VerificationCreateResponse(BaseModel):
    success: bool
    verification_id: Optional[str]
    message: Optional[str]


class VerificationListResponse(BaseModel):
    verifications: list[VerificationRecord]

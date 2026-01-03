from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from services import supabase_service, ml_runner
from services.auth import get_current_user
from models.files import VerificationCreateResponse
import tempfile
import os

router = APIRouter(prefix="/api", tags=["verify"])


async def _background_verify(verification_id: str, upload: dict):
    # download file from supabase storage to a temp file and run ML
    bucket = upload["bucket"]
    storage_path = upload["storage_path"]
    tmpdir = tempfile.gettempdir()
    tmpfile = os.path.join(
        tmpdir, f"{verification_id}_{os.path.basename(storage_path)}")

    try:
        await supabase_service.download_file_to_temp(bucket, storage_path, tmpfile)
    except Exception as e:
        await supabase_service.update_verification(verification_id, {
            "status": "error",
            "details": {"error": str(e)}
        })
        return

    try:
        result = ml_runner.run_verification_file(tmpfile)
    except Exception as e:
        await supabase_service.update_verification(verification_id, {
            "status": "error",
            "details": {"error": str(e)}
        })
        return

    # compute scaled 0-100 score (higher is better fairness)
    raw_score = result.get("score", 0.0)
    scaled = int(round(max(0.0, min(1.0, 1.0 - raw_score)) * 100))

    # update verification
    await supabase_service.update_verification(verification_id, {
        "status": "done",
        "score": raw_score,
        "scaled_score": scaled,
        "report": result.get("report"),
        "details": result.get("details")
    })


@router.post("/verify/{upload_id}", response_model=VerificationCreateResponse)
async def verify_upload(upload_id: str, background_tasks: BackgroundTasks, user=Depends(get_current_user)):
    # check upload exists and belongs to user
    upload = await supabase_service.get_upload_by_id(upload_id)
    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Upload not found")
    if upload["user_id"] != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")

    # create verification record
    verification = await supabase_service.create_verification_record(user["id"], upload_id)

    # set upload status to processing
    supabase_service.supabase.table("uploads").update(
        {"status": "processing"}).eq("id", upload_id).execute()

    # schedule background task
    background_tasks.add_task(_background_verify, verification["id"], upload)

    return {"success": True, "verification_id": verification["id"], "message": "Verification scheduled"}


@router.get("/results/{verification_id}")
async def get_result(verification_id: str, user=Depends(get_current_user)):
    v = await supabase_service.get_verification_by_id(verification_id)
    if not v:
        raise HTTPException(status_code=404, detail="Not found")
    if v["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not allowed")
    return v


@router.get("/history")
async def get_history(user=Depends(get_current_user)):
    res = await supabase_service.list_verifications_for_user(user["id"])
    return {"verifications": res}

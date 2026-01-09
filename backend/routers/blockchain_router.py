"""
Blockchain API endpoints for audit and performance comparison
Read-only router (AUDITOR role)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from services.blockchain.blockchain_manager import (
    BlockchainManager,
    BlockchainAccessRole
)
from services.auth import get_current_user
from services import supabase_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/blockchain",
    tags=["blockchain"]
)

# Initialize blockchain manager in read-only (auditor) mode
blockchain_manager = BlockchainManager(
    access_role=BlockchainAccessRole.AUDITOR
)


@router.get("/performance/{verification_id}")
async def get_blockchain_performance(
    verification_id: str,
    user=Depends(get_current_user)
):
    """
    Compare performance of Hyperledger Fabric vs MultiChain
    Returns query times and availability
    """
    comparison = blockchain_manager.get_performance_comparison(verification_id)
    return comparison


@router.get("/audit/{verification_id}")
async def audit_verification(
    verification_id: str,
    user=Depends(get_current_user)
):
    """
    Audit blockchain integrity for a verification.
    Returns:
    - Stored hashes
    - Blockchain transaction metadata
    - Integrity verification result
    """

    # Fetch verification from Supabase
    verification = await supabase_service.get_verification_by_id(verification_id)
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )

    # Authorization check
    if verification["user_id"] != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to audit this verification"
        )

    file_hash = verification.get("file_hash")
    ml_report_hash = verification.get("ml_report_hash")

    if not file_hash or not ml_report_hash:
        return {
            "verification_id": verification_id,
            "status": "incomplete",
            "message": "Hashes not available for integrity verification"
        }

    # Run blockchain integrity verification
    integrity_result = blockchain_manager.verify_integrity(
        verification_id,
        file_hash,
        ml_report_hash
    )

    blockchain_data = verification.get("blockchain", {})
    blockchain_results = blockchain_data.get("blockchain_results", {})

    return {
        "verification_id": verification_id,
        "stored_hashes": {
            "file_hash": file_hash,
            "ml_report_hash": ml_report_hash
        },
        "blockchain_transactions": blockchain_results,
        "integrity_status": integrity_result,
        "chains_used": list(blockchain_results.keys())
    }

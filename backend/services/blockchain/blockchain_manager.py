"""
Blockchain manager for coordinating multiple blockchain backends.

Responsibilities:
- Abstract Hyperledger Fabric and MultiChain behind a single interface
- Enforce role-based access control (VERIFIER vs AUDITOR)
- Ensure blockchain failures are non-blocking for ML verification
- Enable performance comparison between blockchains
"""

import os
import time
import logging
from enum import Enum
from typing import Dict, Any

from .hyperledger_fabric import (
    HyperledgerFabricService,
    BlockchainNetworkError,
    BlockchainValidationError,
    BlockchainChainError
)
from .multichain import (
    MultiChainService,
    BlockchainNetworkError as MCNetworkError,
    BlockchainValidationError as MCValidationError,
    BlockchainChainError as MCChainError
)

logger = logging.getLogger(__name__)


# -------------------- Enums --------------------

class BlockchainType(str, Enum):
    HYPERLEDGER_FABRIC = "hyperledger_fabric"
    MULTICHAIN = "multichain"
    BOTH = "both"


class BlockchainAccessRole(str, Enum):
    VERIFIER = "verifier"   # Can write
    AUDITOR = "auditor"     # Read-only


# -------------------- Manager --------------------

class BlockchainManager:
    """
    Coordinates blockchain operations across multiple implementations.

    SECURITY MODEL:
    - VERIFIER role: can write + read
    - AUDITOR role: read-only
    """

    def __init__(self, access_role: BlockchainAccessRole = BlockchainAccessRole.VERIFIER):
        self.access_role = access_role
        self.hyperledger = None
        self.multichain = None

        blockchain_enabled = os.environ.get("BLOCKCHAIN_ENABLED", "false").lower() == "true"
        if not blockchain_enabled:
            logger.info("Blockchain disabled via environment flag")
            return

        # Initialize services only if needed
        if self.access_role == BlockchainAccessRole.VERIFIER:
            self._init_write_services()
        else:
            self._init_read_services()

    # -------------------- Initialization --------------------

    def _init_write_services(self):
        """Initialize blockchain services with write capability"""
        try:
            self.hyperledger = HyperledgerFabricService()
            logger.info("Hyperledger Fabric initialized (verifier mode)")
        except Exception as e:
            logger.warning(f"Hyperledger Fabric unavailable: {e}")

        try:
            self.multichain = MultiChainService()
            logger.info("MultiChain initialized (verifier mode)")
        except Exception as e:
            logger.warning(f"MultiChain unavailable: {e}")

    def _init_read_services(self):
        """Initialize blockchain services for read-only access"""
        try:
            self.hyperledger = HyperledgerFabricService()
        except Exception:
            pass

        try:
            self.multichain = MultiChainService()
        except Exception:
            pass

        logger.info("Blockchain manager initialized in auditor (read-only) mode")

    # -------------------- Write API --------------------

    def store_verification_result(
        self,
        verification_id: str,
        file_hash: str,
        ml_report_hash: str,
        bias_score: float,
        blockchain_type: BlockchainType = BlockchainType.BOTH
    ) -> Dict[str, Any]:
        """
        Store verification data on selected blockchain(s).

        IMPORTANT:
        - This method is NON-BLOCKING
        - Errors are logged and returned, not raised
        """

        if self.access_role != BlockchainAccessRole.VERIFIER:
            raise PermissionError("Write access denied for auditor role")

        results = {
            "verification_id": verification_id,
            "blockchain_results": {},
            "errors": []
        }

        # ---- Hyperledger Fabric ----
        if blockchain_type in (BlockchainType.HYPERLEDGER_FABRIC, BlockchainType.BOTH) and self.hyperledger:
            try:
                start = time.time()
                res = self.hyperledger.store_verification_result(
                    verification_id,
                    file_hash,
                    ml_report_hash,
                    bias_score
                )
                res["execution_time_ms"] = round((time.time() - start) * 1000, 2)
                results["blockchain_results"]["hyperledger_fabric"] = res
            except (BlockchainNetworkError, BlockchainValidationError, BlockchainChainError) as e:
                logger.error(f"Hyperledger Fabric error (non-blocking): {e}")
                results["blockchain_results"]["hyperledger_fabric"] = {
                    "success": False,
                    "error": str(e)
                }
                results["errors"].append(f"hyperledger_fabric: {e}")

        # ---- MultiChain ----
        if blockchain_type in (BlockchainType.MULTICHAIN, BlockchainType.BOTH) and self.multichain:
            try:
                start = time.time()
                res = self.multichain.store_verification_result(
                    verification_id,
                    file_hash,
                    ml_report_hash,
                    bias_score
                )
                res["execution_time_ms"] = round((time.time() - start) * 1000, 2)
                results["blockchain_results"]["multichain"] = res
            except (MCNetworkError, MCValidationError, MCChainError) as e:
                logger.error(f"MultiChain error (non-blocking): {e}")
                results["blockchain_results"]["multichain"] = {
                    "success": False,
                    "error": str(e)
                }
                results["errors"].append(f"multichain: {e}")

        return results

    # -------------------- Read / Comparison API --------------------

    def get_performance_comparison(self, verification_id: str) -> Dict[str, Any]:
        """Compare query performance across blockchains"""

        comparison = {
            "verification_id": verification_id,
            "comparison": {}
        }

        if self.hyperledger:
            try:
                start = time.time()
                data = self.hyperledger.get_verification_result(verification_id)
                comparison["comparison"]["hyperledger_fabric"] = {
                    "query_time_ms": round((time.time() - start) * 1000, 2),
                    "data_available": data is not None
                }
            except Exception as e:
                comparison["comparison"]["hyperledger_fabric"] = {"error": str(e)}

        if self.multichain:
            try:
                start = time.time()
                data = self.multichain.get_verification_result(verification_id)
                comparison["comparison"]["multichain"] = {
                    "query_time_ms": round((time.time() - start) * 1000, 2),
                    "data_available": data is not None
                }
            except Exception as e:
                comparison["comparison"]["multichain"] = {"error": str(e)}

        return comparison
       def verify_integrity(
        self,
        verification_id: str,
        file_hash: str,
        ml_report_hash: str
    ) -> Dict[str, Any]:
        """
        Verify data integrity across all available blockchains
        """

        integrity_results = {
            "verification_id": verification_id,
            "integrity_checks": {}
        }

        # Hyperledger Fabric check
        if self.hyperledger and hasattr(self.hyperledger, "verify_integrity"):
            try:
                hf_result = self.hyperledger.verify_integrity(
                    verification_id,
                    file_hash,
                    ml_report_hash
                )
                integrity_results["integrity_checks"]["hyperledger_fabric"] = hf_result
            except Exception as e:
                integrity_results["integrity_checks"]["hyperledger_fabric"] = {
                    "verified": False,
                    "error": str(e)
                }

        # MultiChain check
        if self.multichain and hasattr(self.multichain, "verify_integrity"):
            try:
                mc_result = self.multichain.verify_integrity(
                    verification_id,
                    file_hash,
                    ml_report_hash
                )
                integrity_results["integrity_checks"]["multichain"] = mc_result
            except Exception as e:
                integrity_results["integrity_checks"]["multichain"] = {
                    "verified": False,
                    "error": str(e)
                }

        # Overall integrity result
        checks = integrity_results["integrity_checks"].values()
        integrity_results["overall_verified"] = any(
            check.get("verified", False) for check in checks
        )

        return integrity_results
 
    

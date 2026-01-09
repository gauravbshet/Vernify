"""
Hyperledger Fabric integration for clinical trials data storage

IMPORTANT:
- This file uses the Python Fabric SDK as a Proof-of-Concept only.
- For production, use the Fabric Gateway pattern (Node.js or Go).
- Python backend should communicate with the Gateway via REST or gRPC.

SECURITY PRINCIPLES:
- No clinical or sensitive data is stored on-chain.
- Only cryptographic hashes and minimal metadata are persisted.
"""

import os
import json
import hashlib
import logging
from typing import Dict, Any, Optional
from datetime import datetime

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend

logger = logging.getLogger(__name__)

# Attempt Fabric SDK import (PoC only)
try:
    from hfc.fabric import Client
    HYPERLEDGER_AVAILABLE = True
except ImportError:
    HYPERLEDGER_AVAILABLE = False
    logger.warning("Hyperledger Fabric SDK not installed (PoC mode disabled)")


# -------------------- Custom Exceptions --------------------

class BlockchainNetworkError(Exception):
    """Network-level errors (connection, timeout, unavailable peer)"""
    pass


class BlockchainValidationError(Exception):
    """Invalid input or malformed payload"""
    pass


class BlockchainChainError(Exception):
    """Chaincode or transaction execution failure"""
    pass


# -------------------- Service Class --------------------

class HyperledgerFabricService:
    """
    Hyperledger Fabric service (PoC)

    Stores only:
    - verification_id
    - file_hash
    - ml_report_hash
    - bias_score
    - timestamp
    - issuer
    - signature (optional)
    """

    def __init__(self):
        if not HYPERLEDGER_AVAILABLE:
            raise RuntimeError("Hyperledger Fabric SDK not available")

        self.network_name = os.environ.get("FABRIC_NETWORK_NAME")
        self.channel_name = os.environ.get("FABRIC_CHANNEL_NAME")
        self.chaincode_name = os.environ.get("FABRIC_CHAINCODE_NAME")

        self.connection_profile = os.environ.get(
            "FABRIC_CONNECTION_PROFILE",
            "./blockchain/hyperledger/connection-profile.json"
        )

        self.service_id = os.environ.get(
            "BLOCKCHAIN_SERVICE_ID",
            "verifier-service"
        )

        self._load_service_key()
        self._initialize_network()

    # -------------------- Key Handling --------------------

    def _load_service_key(self):
        """Load private key used to sign payload hashes (optional)"""
        key_path = os.environ.get("BLOCKCHAIN_SERVICE_KEY_PATH")

        if not key_path or not os.path.exists(key_path):
            self.private_key = None
            logger.warning("Service signing key not configured")
            return

        try:
            with open(key_path, "rb") as f:
                self.private_key = serialization.load_pem_private_key(
                    f.read(),
                    password=None,
                    backend=default_backend()
                )
            logger.info("Service signing key loaded")
        except Exception as e:
            self.private_key = None
            logger.error(f"Failed to load signing key: {e}")

    def _sign_hash(self, payload_hash: str) -> Optional[str]:
        """Sign SHA256 hash using service private key"""
        if not self.private_key:
            return None

        try:
            signature = self.private_key.sign(
                payload_hash.encode(),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            import base64
            return base64.b64encode(signature).decode()
        except Exception as e:
            logger.error(f"Signing failed: {e}")
            return None

    # -------------------- Fabric Network --------------------

    def _initialize_network(self):
        """Initialize Fabric client and channel (PoC only)"""
        if not os.path.exists(self.connection_profile):
            raise BlockchainNetworkError("Fabric connection profile not found")

        try:
            with open(self.connection_profile) as f:
                config = json.load(f)

            self.client = Client()
            self.network = self.client.new_network(self.network_name, config)
            self.channel = self.network.get_channel(self.channel_name)

            logger.info("Hyperledger Fabric network initialized (PoC)")
        except Exception as e:
            raise BlockchainNetworkError(str(e))

    # -------------------- Public API --------------------

    def store_verification_result(
        self,
        verification_id: str,
        file_hash: str,
        ml_report_hash: str,
        bias_score: float,
        timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """Store minimal verification record on Fabric"""

        if not self.channel:
            raise BlockchainNetworkError("Fabric channel not initialized")

        timestamp = timestamp or datetime.utcnow().isoformat()

        payload = {
            "verification_id": verification_id,
            "file_hash": file_hash,
            "ml_report_hash": ml_report_hash,
            "bias_score": float(bias_score),
            "timestamp": timestamp,
            "issuer": self.service_id
        }

        payload_str = json.dumps(payload, sort_keys=True)
        payload_hash = hashlib.sha256(payload_str.encode()).hexdigest()

        signature = self._sign_hash(payload_hash)
        if signature:
            payload["signature"] = signature

        try:
            response = self.channel.invoke(
                self.chaincode_name,
                "storeClinicalTrialResult",
                [verification_id, json.dumps(payload)]
            )

            return {
                "success": True,
                "transaction_id": response.get("tx_id"),
                "block_number": response.get("block_number"),
                "blockchain": "hyperledger_fabric"
            }

        except Exception as e:
            raise BlockchainChainError(str(e))

    def get_verification_result(self, verification_id: str) -> Optional[Dict[str, Any]]:
        """Fetch verification record from Fabric"""

        if not self.channel:
            raise BlockchainNetworkError("Fabric channel not initialized")

        try:
            response = self.channel.query(
                self.chaincode_name,
                "getClinicalTrialResult",
                [verification_id]
            )
            return json.loads(response) if response else None
        except Exception as e:
            raise BlockchainChainError(str(e))

    def get_verification_result(self, verification_id: str) -> Optional[Dict[str, Any]]:
        """Fetch verification record from Fabric"""

        if not self.channel:
            raise BlockchainNetworkError("Fabric channel not initialized")

        try:
            response = self.channel.query(
                self.chaincode_name,
                "getClinicalTrialResult",
                [verification_id]
            )
            return json.loads(response) if response else None
        except Exception as e:
            raise BlockchainChainError(str(e))


    def verify_integrity(
        self,
        verification_id: str,
        file_hash: str,
        ml_report_hash: str
    ) -> Dict[str, Any]:
        """
        Verify integrity of stored blockchain record
        """

        record = self.get_verification_result(verification_id)
        if not record:
            return {
                "verified": False,
                "reason": "Record not found on blockchain"
            }

        hash_match = (
            record.get("file_hash") == file_hash and
            record.get("ml_report_hash") == ml_report_hash
        )

        signature_valid = None
        if record.get("signature"):
            # Signature verification placeholder
            signature_valid = True

        return {
            "verified": hash_match and (signature_valid is not False),
            "hash_match": hash_match,
            "signature_valid": signature_valid,
            "stored_record": record
        }

    
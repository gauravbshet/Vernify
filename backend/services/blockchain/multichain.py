"""
MultiChain integration for clinical trials data storage

Uses JSON-RPC over HTTP for secure, authenticated communication.

SECURITY PRINCIPLES:
- No clinical or sensitive data is stored on-chain.
- Only cryptographic hashes and minimal metadata are persisted.
"""

import os
import json
import hashlib
import logging
import requests
from typing import Dict, Any, Optional
from datetime import datetime
from base64 import b64encode

logger = logging.getLogger(__name__)


# -------------------- Custom Exceptions --------------------

class BlockchainNetworkError(Exception):
    """Network-level errors (RPC unavailable, timeout)"""
    pass


class BlockchainValidationError(Exception):
    """Invalid parameters or malformed data"""
    pass


class BlockchainChainError(Exception):
    """Chain execution or stream failure"""
    pass


# -------------------- Service Class --------------------

class MultiChainService:
    """
    MultiChain service using stream-based storage.

    Stream: clinical_trials
    Key: verification_id
    """

    def __init__(self):
        self.chain_name = os.environ.get("MULTICHAIN_CHAIN_NAME", "clinical-trials-chain")
        self.rpc_user = os.environ.get("MULTICHAIN_RPC_USER", "multichainrpc")
        self.rpc_password = os.environ.get("MULTICHAIN_RPC_PASSWORD", "")
        self.rpc_port = int(os.environ.get("MULTICHAIN_RPC_PORT", "8570"))
        self.rpc_host = os.environ.get("MULTICHAIN_RPC_HOST", "localhost")

        self.service_id = os.environ.get("BLOCKCHAIN_SERVICE_ID", "verifier-service")
        self.stream_name = "clinical_trials"

        self.rpc_url = f"http://{self.rpc_host}:{self.rpc_port}"
        self.auth_header = self._build_auth_header()

        logger.info(f"MultiChain RPC initialized at {self.rpc_url}")

    # -------------------- RPC Helpers --------------------

    def _build_auth_header(self) -> Dict[str, str]:
        credentials = f"{self.rpc_user}:{self.rpc_password}"
        encoded = b64encode(credentials.encode()).decode()
        return {"Authorization": f"Basic {encoded}"}

    def _rpc_call(self, method: str, params: list) -> Any:
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params
        }

        try:
            response = requests.post(
                self.rpc_url,
                json=payload,
                headers=self.auth_header,
                timeout=30
            )
            response.raise_for_status()
            result = response.json()

            if result.get("error"):
                message = result["error"].get("message", "Unknown error")
                code = result["error"].get("code", -1)

                if code in (-32600, -32602):
                    raise BlockchainValidationError(message)
                elif code in (-32603,):
                    raise BlockchainChainError(message)
                else:
                    raise BlockchainNetworkError(message)

            return result.get("result")

        except requests.exceptions.Timeout:
            raise BlockchainNetworkError("MultiChain RPC timeout")
        except requests.exceptions.ConnectionError:
            raise BlockchainNetworkError("MultiChain RPC connection failed")
        except requests.exceptions.RequestException as e:
            raise BlockchainNetworkError(str(e))
        except json.JSONDecodeError:
            raise BlockchainNetworkError("Invalid JSON response")

    # -------------------- Public API --------------------

    def store_verification_result(
        self,
        verification_id: str,
        file_hash: str,
        ml_report_hash: str,
        bias_score: float,
        timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """Publish minimal verification record to MultiChain stream"""

        timestamp = timestamp or datetime.utcnow().isoformat()

        payload = {
            "verification_id": verification_id,
            "file_hash": file_hash,
            "ml_report_hash": ml_report_hash,
            "bias_score": float(bias_score),
            "timestamp": timestamp,
            "issuer": self.service_id
        }

        data_json = json.dumps(payload)
        data_hex = data_json.encode().hex()

        try:
            txid = self._rpc_call(
                "publish",
                [self.stream_name, verification_id, data_hex]
            )

            return {
                "success": True,
                "transaction_id": txid,
                "blockchain": "multichain"
            }

        except Exception as e:
            logger.error(f"MultiChain publish failed: {e}")
            raise BlockchainChainError(str(e))

    def get_verification_result(self, verification_id: str) -> Optional[Dict[str, Any]]:
        """Fetch latest verification record from MultiChain"""

        try:
            items = self._rpc_call(
                "liststreamkeyitems",
                [self.stream_name, verification_id]
            )

            if not items:
                return None

            latest = items[-1]
            data_hex = latest.get("data")

            if not data_hex:
                return None

            return json.loads(bytes.fromhex(data_hex).decode())

        except Exception as e:
            logger.error(f"MultiChain query failed: {e}")
            raise BlockchainNetworkError(str(e))

    def verify_integrity(
        self,
        verification_id: str,
        file_hash: str,
        ml_report_hash: str
    ) -> Dict[str, Any]:
        """
        Verify data integrity for a verification record stored on MultiChain
        """

        try:
            stored_record = self.get_verification_result(verification_id)
        except Exception as e:
            return {
                "verified": False,
                "reason": f"Query failed: {str(e)}"
            }

        if not stored_record:
            return {
                "verified": False,
                "reason": "Record not found on blockchain"
            }

        hash_match = (
            stored_record.get("file_hash") == file_hash and
            stored_record.get("ml_report_hash") == ml_report_hash
        )

        return {
            "verified": hash_match,
            "hash_match": hash_match,
            "stored_record": stored_record
        }

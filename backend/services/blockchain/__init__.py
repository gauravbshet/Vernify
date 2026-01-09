"""
Blockchain services package

This package contains blockchain integration logic for:
- Hyperledger Fabric (PoC / Gateway-based architecture)
- MultiChain (JSON-RPC over HTTP)

Design principles:
- No sensitive or clinical data is stored on-chain
- Only cryptographic hashes and minimal metadata are persisted
- Blockchain failures must NOT block ML verification flow
- Supports multiple blockchain backends for comparison

This module is intentionally infrastructure-only and has no
direct dependency on FastAPI routers or ML logic.
"""

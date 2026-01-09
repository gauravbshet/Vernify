
from routers.verify_router import router as verify_router
from routers import blockchain_router
from routers.uploads_router import router as uploads_router
from routers import auth_router  # Import the authentication router
from services import auth as auth_service
from models.auth import AuthResponse  # Assuming this is correctly defined
from fastapi import FastAPI, Query, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import sys
from pathlib import Path
# from dotenv import load_dotenv

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent))


# Initialize FastAPI app
app = FastAPI(
    title="EDTECH for Students",
    description="API for EDTECH for Students",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Dependency ---
token_auth_scheme = HTTPBearer()


# Include the authentication router
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])

# Include upload and verification routers

app.include_router(uploads_router)
app.include_router(verify_router)
app.include_router(blockchain_router.router)
# Startup check


@app.on_event("startup")
async def startup_event():
    # Basic environment check for Supabase configuration
    import os
    if not os.environ.get("SUPABASE_URL") or not os.environ.get("SUPABASE_KEY"):
        print("Warning: SUPABASE_URL or SUPABASE_KEY not found. Set them in environment for storage and DB features to work.")

# Routes


@app.get("/")
async def root():
    return {"status": "ok", "message": "signin working fine"}


@app.get("/internal/health-ml")
async def health_ml():
    """Quick check to confirm `ml` package can be imported and used by the backend.
    Returns an error message when import fails so you can see helpful debug info.
    """
    try:
        import sys
        from pathlib import Path
        repo_root = Path(__file__).resolve().parents[0].parent
        if str(repo_root) not in sys.path:
            sys.path.insert(0, str(repo_root))
        # try loading a small ML helper
        from ml import loader, detector  # type: ignore
        return {"ok": True, "message": "ml import succeeded"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


from routers.verify_router import router as verify_router
from routers import blockchain_router
from routers.uploads_router import router as uploads_router
from routers import auth_router  # Import the authentication router
from services import auth as auth_service
# Assuming these are correctly defined
from models.auth import AuthResponse, SignInRequest
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
    title="Vernify APIs",
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


def _get_token(credentials: HTTPAuthorizationCredentials = Depends(token_auth_scheme)) -> str:
    """Extract bearer token from HTTPBearer dependency."""
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return credentials.credentials


async def _get_user_from_token(token: str):
    """Validate token with Supabase and return user object (via `services.auth`)."""
    user_resp = await auth_service.get_user_from_token(token)
    if not user_resp.success:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_resp.data["user"]


def _get_profile_role(user_id: str) -> str:
    """Read role from `public.profiles` using the service role key (server-side).
    Expects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be present in env."""
    import os
    import requests

    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not SUPABASE_URL or not SERVICE_KEY:
        raise HTTPException(
            status_code=500, detail="Server misconfigured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing")

    headers = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}
    url = f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}&select=role"
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch profile")
    rows = r.json()
    if not rows:
        raise HTTPException(status_code=404, detail="Profile not found")
    return rows[0].get("role")


def require_roles(*allowed_roles: str):
    """Dependency factory that validates the user's role.
    - Admins are treated as having access to all endpoints (unless you want exact-match behavior).
    - Provide roles as e.g. require_roles('validator', 'admin')
    """

    async def dependency(token: str = Depends(_get_token)):
        user = await _get_user_from_token(token)
        role = _get_profile_role(user["id"])
        # Admins can access everything
        if role == 'admin':
            return {"id": user["id"], "email": user.get("email"), "role": role}
        if role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return {"id": user["id"], "email": user.get("email"), "role": role}

    return dependency


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


@app.post("/signin/admin")
async def signin_admin(credentials: SignInRequest):
    """Sign in with email/password and require Admin role.
    Returns session and role if successful.
    """
    auth_resp = await auth_service.sign_in_user(credentials)
    if not auth_resp.success:
        raise HTTPException(
            status_code=401, detail=auth_resp.message or "Sign in failed")
    data = auth_resp.data or {}
    user_id = data.get("user_id")
    session = data.get("session")
    if not user_id:
        raise HTTPException(
            status_code=500, detail="Sign in succeeded but no user id returned")
    role = _get_profile_role(user_id)
    if role != 'admin':
        raise HTTPException(
            status_code=403, detail="Forbidden: admin role required")
    return {"success": True, "role": role, "user_id": user_id, "session": session}


@app.post("/signin/validator")
async def signin_validator(credentials: SignInRequest):
    """Sign in with email/password and allow Validator or Admin roles."""
    auth_resp = await auth_service.sign_in_user(credentials)
    if not auth_resp.success:
        raise HTTPException(
            status_code=401, detail=auth_resp.message or "Sign in failed")
    data = auth_resp.data or {}
    user_id = data.get("user_id")
    session = data.get("session")
    if not user_id:
        raise HTTPException(
            status_code=500, detail="Sign in succeeded but no user id returned")
    role = _get_profile_role(user_id)
    if role not in ('validator', 'admin'):
        raise HTTPException(
            status_code=403, detail="Forbidden: validator or admin role required")
    return {"success": True, "role": role, "user_id": user_id, "session": session}


@app.post("/signin/user")
async def signin_user(credentials: SignInRequest):
    """Sign in with email/password and allow User, Validator, or Admin roles."""
    auth_resp = await auth_service.sign_in_user(credentials)
    if not auth_resp.success:
        raise HTTPException(
            status_code=401, detail=auth_resp.message or "Sign in failed")
    data = auth_resp.data or {}
    user_id = data.get("user_id")
    session = data.get("session")
    if not user_id:
        raise HTTPException(
            status_code=500, detail="Sign in succeeded but no user id returned")
    role = _get_profile_role(user_id)
    if role not in ('user', 'validator', 'admin'):
        raise HTTPException(
            status_code=403, detail="Forbidden: user role required")
    return {"success": True, "role": role, "user_id": user_id, "session": session}


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

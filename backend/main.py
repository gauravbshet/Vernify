from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from routers.verify_router import router as verify_router
from routers.uploads_router import router as uploads_router
from routers import blockchain_router, auth_router

from services import auth as auth_service

import os
import httpx

# --------------------------------------------------
# App init
# --------------------------------------------------

app = FastAPI(
    title="Vernify APIs",
    description="API for Vernify Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Auth helpers
# --------------------------------------------------

security = HTTPBearer()


def get_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    if not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return credentials.credentials


async def get_user_from_token(token: str):
    resp = await auth_service.get_user_from_token(token)
    if not resp.success:
        raise HTTPException(status_code=401, detail="Invalid token")
    return resp.data["user"]


async def get_profile_role(user_id: str) -> str:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not SUPABASE_URL or not SERVICE_KEY:
        raise HTTPException(status_code=500, detail="Supabase misconfigured")

    url = f"{SUPABASE_URL}/rest/v1/profiles"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
    }
    params = {
        "id": f"eq.{user_id}",
        "select": "role",
    }

    async with httpx.AsyncClient(timeout=5) as client:
        resp = await client.get(url, headers=headers, params=params)

    if resp.status_code != 200:
        raise HTTPException(status_code=404, detail="Profile not found")

    try:
        data = resp.json()
        if not data or len(data) == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
        return data[0]["role"]
    except (ValueError, KeyError, IndexError) as e:
        raise HTTPException(status_code=404, detail=f"Profile not found: {str(e)}")


def require_roles(*allowed_roles: str):
    async def dependency(token: str = Depends(get_token)):
        user = await get_user_from_token(token)
        role = await get_profile_role(user["id"])

        # Admin override
        if role == "admin":
            return {"id": user["id"], "email": user.get("email"), "role": role}

        if role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Forbidden")

        return {"id": user["id"], "email": user.get("email"), "role": role}

    return dependency


# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(uploads_router)
app.include_router(verify_router)
app.include_router(blockchain_router.router)

# --------------------------------------------------
# Routes
# --------------------------------------------------


@app.get("/")
async def root():
    return {"status": "ok", "message": "Vernify backend running"}


# --------------------------------------------------
# ROLE-PROTECTED ROUTES
# --------------------------------------------------

@app.get("/admin/dashboard")
async def admin_dashboard(user=Depends(require_roles("admin"))):
    return {"message": "Welcome Admin", "user": user}


@app.get("/validator/dashboard")
async def validator_dashboard(user=Depends(require_roles("validator"))):
    return {"message": "Welcome Validator", "user": user}


@app.get("/user/dashboard")
async def user_dashboard(user=Depends(require_roles("user", "validator"))):
    return {"message": "Welcome User", "user": user}


# --------------------------------------------------
# ML health check
# --------------------------------------------------

@app.get("/internal/health-ml")
async def health_ml():
    try:
        from ml import loader, detector  # noqa
        return {"ok": True, "message": "ML import successful"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

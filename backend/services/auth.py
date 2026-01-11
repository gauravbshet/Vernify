import os
from supabase import create_client, Client
from dotenv import load_dotenv
from models.auth import SignUpRequest, SignInRequest, AuthResponse
from fastapi import Request, HTTPException, status

# Optional: Supabase auth error
try:
    from gotrue.errors import AuthApiError
except ImportError:
    AuthApiError = Exception

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Supabase URL or Key not found.")
    supabase: Client | None = None
else:
    supabase: Client | None = create_client(SUPABASE_URL, SUPABASE_KEY)


# --------------------------------------------------
# TOKEN VALIDATION
# --------------------------------------------------

async def get_user_from_token(token: str) -> AuthResponse:
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")

    try:
        api_response = supabase.auth.get_user(jwt=token)

        if api_response and api_response.user:
            u = api_response.user
            return AuthResponse(
                success=True,
                data={
                    "user": {
                        "id": u.id,
                        "email": u.email,
                        "user_metadata": u.user_metadata,
                        "app_metadata": u.app_metadata,
                    }
                }
            )

        return AuthResponse(success=False, message="Invalid token")

    except Exception as e:
        return AuthResponse(success=False, message="Token validation failed", error=str(e))


# --------------------------------------------------
# SIGN UP (NO ROLE ENFORCEMENT)
# --------------------------------------------------

async def sign_up_user(user_credentials: SignUpRequest) -> AuthResponse:
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")

    try:
        auth_response = supabase.auth.sign_up({
            "email": user_credentials.email,
            "password": user_credentials.password,
            "options": {
                "data": {
                    "name": user_credentials.name
                    # ❌ DO NOT set role here
                }
            }
        })

        if auth_response.user:
            return AuthResponse(
                success=True,
                message="User signed up successfully.",
                data={
                    "user_id": auth_response.user.id,
                    "email": auth_response.user.email
                }
            )

        return AuthResponse(success=False, message="Signup failed")

    except Exception as e:
        return AuthResponse(success=False, message="Signup error", error=str(e))


# --------------------------------------------------
# SIGN IN (AUTH ONLY — NO ROLE CHECK)
# --------------------------------------------------

async def sign_in_user(user_credentials: SignInRequest) -> AuthResponse:
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")

    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user_credentials.email,
            "password": user_credentials.password
        })

        if auth_response.session and auth_response.user:
            return AuthResponse(
                success=True,
                message="Signin successful",
                data={
                    "session": auth_response.session.dict(),
                    "user_id": auth_response.user.id,
                    "email": auth_response.user.email
                }
            )

        return AuthResponse(success=False, message="Invalid credentials")

    except Exception as e:
        return AuthResponse(success=False, message="Signin error", error=str(e))


# --------------------------------------------------
# SIGN OUT
# --------------------------------------------------

async def sign_out_user() -> AuthResponse:
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")

    try:
        supabase.auth.sign_out()
        return AuthResponse(success=True, message="Signed out successfully")

    except Exception as e:
        return AuthResponse(success=False, message="Signout error", error=str(e))


# --------------------------------------------------
# CURRENT USER DEPENDENCY
# --------------------------------------------------

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = auth_header.split(" ", 1)[1]
    user_response = await get_user_from_token(token)

    if not user_response.success:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return user_response.data["user"]

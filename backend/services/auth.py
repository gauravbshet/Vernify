import os
from supabase import create_client, Client
from dotenv import load_dotenv
from models.auth import SignUpRequest, SignInRequest, AuthResponse
from fastapi import Request, HTTPException, status, Depends

# Try to import AuthApiError, if not found, use a general Exception for now
try:
    from gotrue.errors import AuthApiError
except ImportError:
    AuthApiError = Exception  # Fallback, will refine later

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Supabase URL or Key not found in environment variables. Auth services will not work.")
    supabase: Client | None = None
else:
    supabase: Client | None = create_client(SUPABASE_URL, SUPABASE_KEY)


async def get_user_from_token(token: str) -> AuthResponse:
    """Validates a JWT and retrieves user information."""
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")
    try:
        # supabase.auth.get_user(jwt=token) returns a UserResponse object
        # which has a 'user' attribute of type User, or 'error' attribute.
        api_response = supabase.auth.get_user(jwt=token)

        if api_response and hasattr(api_response, 'user') and api_response.user and hasattr(api_response.user, 'id'):
            actual_user = api_response.user  # This is the User object
            user_data = {
                "id": actual_user.id,
                "aud": actual_user.aud,
                "role": actual_user.role,
                "email": actual_user.email,
                "email_confirmed_at": actual_user.email_confirmed_at.isoformat() if actual_user.email_confirmed_at else None,
                "phone": actual_user.phone,
                "confirmed_at": actual_user.confirmed_at.isoformat() if actual_user.confirmed_at else None,
                "last_sign_in_at": actual_user.last_sign_in_at.isoformat() if actual_user.last_sign_in_at else None,
                "app_metadata": actual_user.app_metadata,
                "user_metadata": actual_user.user_metadata,
                "identities": [identity.dict() for identity in actual_user.identities] if actual_user.identities else [],
                "created_at": actual_user.created_at.isoformat() if actual_user.created_at else None,
                "updated_at": actual_user.updated_at.isoformat() if actual_user.updated_at else None,
            }
            return AuthResponse(success=True, data={"user": user_data})
        elif api_response and hasattr(api_response, 'error') and api_response.error:
            # This case handles if Supabase/GoTrue itself returns an error object within UserResponse
            # (though usually it raises AuthApiError for token issues)
            return AuthResponse(success=False, message=f"Token validation failed: {api_response.error.message}", error=str(api_response.error))
        else:
            # Fallback if the response structure is unexpected or user is None
            print(
                f"DEBUG: get_user_from_token: api_response was {api_response}, type: {type(api_response)}")
            return AuthResponse(success=False, message="Token valid, but user data not found or response structure unexpected.")

    except AuthApiError as e:  # Catch specific error if available
        # Check if it's the fallback Exception or the actual AuthApiError
        if AuthApiError == Exception:
            return AuthResponse(success=False, message=f"Token validation failed (generic error): {e}", error=str(e))
        return AuthResponse(success=False, message=f"Token validation failed: {getattr(e, 'message', str(e))}", error=str(e))
    except Exception as e:
        # Catch any other unexpected errors during the process
        return AuthResponse(success=False, message="An unexpected error occurred during token validation.", error=str(e))


async def sign_up_user(user_credentials: SignUpRequest) -> AuthResponse:
    """Signs up a new user using Supabase."""
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")
    try:
        auth_response = supabase.auth.sign_up({
            "email": user_credentials.email,
            "password": user_credentials.password,
            "options": {
                "data": {
                    "name": user_credentials.name
                }
            }
        })

        if auth_response.user:
            return AuthResponse(success=True, message="User signed up successfully.", data={"user_id": auth_response.user.id, "email": auth_response.user.email})
        elif auth_response.error:
            return AuthResponse(success=False, message="Sign up failed.", error=auth_response.error.message)
        else:
            return AuthResponse(success=False, message="Sign up failed due to an unknown error.")
    except Exception as e:
        return AuthResponse(success=False, message="An unexpected error occurred during sign up.", error=str(e))


async def sign_in_user(user_credentials: SignInRequest) -> AuthResponse:
    """Signs in an existing user using Supabase."""
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user_credentials.email,
            "password": user_credentials.password
        })
        if auth_response.session and auth_response.user:
            return AuthResponse(success=True, message="User signed in successfully.", data={"session": auth_response.session.dict(), "user_id": auth_response.user.id, "email": auth_response.user.email})
        elif auth_response.error:
            return AuthResponse(success=False, message="Sign in failed.", error=auth_response.error.message)
        else:
            return AuthResponse(success=False, message="Sign in failed due to an unknown error.")
    except Exception as e:
        return AuthResponse(success=False, message="An unexpected error occurred during sign in.", error=str(e))


async def sign_out_user() -> AuthResponse:  # MODIFIED - Supabase sign_out doesn't take a JWT
    """Signs out the current user by invalidating all refresh tokens.
    Note: Access tokens remain valid until expiry. Client should discard the JWT.
    """
    if not supabase:
        return AuthResponse(success=False, message="Auth service not configured.")
    try:
        supabase.auth.sign_out()
        return AuthResponse(success=True, message="User signed out successfully. Client should discard JWT.")
    except AuthApiError as e:  # Catch specific error if available
        if AuthApiError == Exception:
            return AuthResponse(success=False, message=f"Sign out failed (generic error): {e}", error=str(e))
        return AuthResponse(success=False, message=f"Sign out failed: {getattr(e, 'message', str(e))}", error=str(e))
    except Exception as e:
        return AuthResponse(success=False, message="An unexpected error occurred during sign out.", error=str(e))


async def get_current_user(request: Request):
    """Dependency to get the current user from the Authorization header (Bearer token)."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = auth_header.split(" ", 1)[1]
    user_response = await get_user_from_token(token)
    if not user_response.success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user_response.data["user"]

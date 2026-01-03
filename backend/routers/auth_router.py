from fastapi import APIRouter, HTTPException, Depends, status, Response
from models.auth import SignUpRequest, SignInRequest, AuthResponse
from services.auth import sign_up_user, sign_in_user, sign_out_user

router = APIRouter()

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_credentials: SignUpRequest, response: Response):
    result = await sign_up_user(user_credentials)
    if not result.success:
        response.status_code = status.HTTP_400_BAD_REQUEST
        if result.error and "User already registered" in result.error:
             response.status_code = status.HTTP_409_CONFLICT
    return result

@router.post("/signin", response_model=AuthResponse)
async def signin(user_credentials: SignInRequest, response: Response):
    result = await sign_in_user(user_credentials)
    if not result.success:
        response.status_code = status.HTTP_401_UNAUTHORIZED
    return result

@router.post("/signout", response_model=AuthResponse)
async def signout(response: Response):
    result = await sign_out_user()
    if not result.success:
        response.status_code = status.HTTP_400_BAD_REQUEST
    return result
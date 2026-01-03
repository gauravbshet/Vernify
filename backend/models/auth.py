from pydantic import BaseModel, EmailStr

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    success: bool
    message: str | None = None
    data: dict | None = None # To store user session or user data
    error: str | None = None

from enum import Enum
from pydantic import BaseModel, EmailStr


class Role(str, Enum):
    user = "user"
    admin = "admin"
    validator = "validator"


class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.user


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    success: bool
    message: str | None = None
    data: dict | None = None  # To store user session or user data
    error: str | None = None

from pydantic import BaseModel, EmailStr


class RegisterSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
class RefreshTokenRequest(BaseModel):
    refresh_token: str
from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.utils.response import success_response

from app.schemas.auth_schema import (
    RegisterSchema,
    LoginSchema,
    RefreshTokenRequest
)

from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    payload: RegisterSchema,
    db: Session = Depends(get_db)
):

    user = AuthService.register_user(
        db=db,
        full_name=payload.full_name,
        email=payload.email,
        password=payload.password
    )

    return success_response(
        message="User registered successfully",
        data={
            "user_id": user.id,
            "email": user.email
        }
    )


@router.post("/login")
def login(
    payload: LoginSchema,
    db: Session = Depends(get_db)
):

    login_data = AuthService.login_user(
        db=db,
        email=payload.email,
        password=payload.password
    )

    return success_response(
        message="Login successful",
        data=login_data
    )


@router.post("/refresh")
def refresh_token(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db)
):

    token_data = AuthService.refresh_access_token(
        db=db,
        refresh_token=payload.refresh_token
    )

    return success_response(
        message="Token refreshed successfully",
        data=token_data
    )
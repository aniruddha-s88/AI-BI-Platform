from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.exceptions import AppException
from app.repositories.user_repository import UserRepository
from app.repositories.auth_repository import AuthRepository

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token
)


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        full_name: str,
        email: str,
        password: str
    ):

        existing_user = UserRepository.get_user_by_email(
            db,
            email
        )

        if existing_user:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Email already registered"
            )

        hashed_password = hash_password(password)

        user_data = {
            "full_name": full_name,
            "email": email,
            "hashed_password": hashed_password
        }

        return UserRepository.create_user(
            db,
            user_data
        )

    @staticmethod
    def login_user(
        db: Session,
        email: str,
        password: str
    ):

        user = UserRepository.get_user_by_email(
            db,
            email
        )

        if not user:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Invalid credentials"
            )

        if not verify_password(
            password,
            user.hashed_password
        ):
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Invalid credentials"
            )

        access_token = create_access_token(
            data={
                "sub": user.email
            }
        )

        refresh_token = create_refresh_token()

        AuthRepository.create_refresh_token(
            db=db,
            token=refresh_token,
            user_id=user.id
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    def refresh_access_token(
        db: Session,
        refresh_token: str
    ):

        stored_token = AuthRepository.get_refresh_token(
            db,
            refresh_token
        )

        if not stored_token:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Invalid refresh token"
            )

        access_token = create_access_token(
            data={
                "sub": stored_token.user.email
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
from sqlalchemy.orm import Session
from app.core.security import create_refresh_token

from app.models.refresh_token import RefreshToken


class AuthRepository:

    @staticmethod
    def create_refresh_token(
        db: Session,
        token: str,
        user_id: int
    ):

        refresh_token = RefreshToken(
            token=token,
            user_id=user_id
        )

        db.add(refresh_token)

        db.commit()

        db.refresh(refresh_token)

        return refresh_token


    @staticmethod
    def get_refresh_token(
        db: Session,
        token: str
    ):

        return db.query(RefreshToken).filter(
            RefreshToken.token == token
        ).first()


    @staticmethod
    def delete_refresh_token(
        db: Session,
        token: str
    ):

        refresh_token = db.query(
            RefreshToken
        ).filter(
            RefreshToken.token == token
        ).first()

        if refresh_token:
            db.delete(refresh_token)
            db.commit()
from fastapi import APIRouter, Depends
from app.utils.response import success_response
from app.api.dependencies.auth_dependency import (
    get_current_user
)

from app.models.user import User


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return success_response(
    message="User fetched successfully",
    data={
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email
    }
)
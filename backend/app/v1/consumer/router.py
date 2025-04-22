from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID

from app.v1 import models
from app.v1.consumer import responseModels, schemas
from app.v1.utils.database import SessionDep

router = APIRouter(prefix="/consumer", tags=["Consumer"])


@router.get("/{phone_number}", response_model=responseModels.ShowUser, status_code=status.HTTP_200_OK)
def get_user(phone_number: int, db: SessionDep) -> responseModels.ShowUser:
    """
    Get user details by phone number.
    """
    user = db.get(models.User, phone_number)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.put("/{phone_number}", response_model=responseModels.ShowUser, status_code=status.HTTP_200_OK)
def update_user(phone_number: int, user_data: schemas.ConsumerUpdate, db: SessionDep) -> responseModels.ShowUser:
    """
    Update user details by phone number.
    """
    user = db.get(models.User, phone_number)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.first_name = user_data.first_name if user_data.first_name else user.first_name
    user.last_name = user_data.last_name if user_data.last_name else user.last_name

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while updating user",
        )
    return user

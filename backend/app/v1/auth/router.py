from fastapi import APIRouter, Depends, HTTPException, status
from app.v1.auth import schemas, responseModels
from app.v1.utils import database
from app.v1.auth.managers import OTPManager
from app.v1 import models
from sqlmodel import select


router = APIRouter()


@router.post("/register/request-otp", status_code=status.HTTP_201_CREATED)
def register(request: schemas.RegisterOTPRequest, db: database.SessionDep):
    try:
        user = db.get(models.User, request.phone_no)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )

    if not user:
        user = models.User(
            phone_no=request.phone_no,
            is_active=False,
        )
        db.add(user)

        if request.type == "farmer":
            farmer = models.Farmer(
                phone_no=request.phone_no,
                is_active=False,
            )
            db.add(farmer)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user type",
            )

        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error",
            )

        OTPManager.generate_otp(otp_length=4, phone_no=request.phone_no, db=db)

        return HTTPException(status_code=status.HTTP_200_OK, detail="User registered successfully")

    elif user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered",
        )


@router.post("/register/verify-otp", response_model=responseModels.ShowUser, status_code=status.HTTP_200_OK)
def verify_otp(request: schemas.OTPVerificationRequest, db: database.SessionDep) -> models.User:
    """Verify OTP for a user"""
    if OTPManager.verify_otp(phone_no=request.phone_no, otp=request.otp, db=db):
        user = db.get(models.User, request.phone_no)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        user.is_active = True

        try:
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error",
            )

        return user
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP",
        )


@router.post("/register/resend-otp", status_code=status.HTTP_200_OK)
def resend_otp(request: schemas.OTPRequest, db: database.SessionDep):
    """Resend OTP to a user"""
    try:
        OTPManager.generate_otp(otp_length=4, phone_no=request.phone_no, db=db)
    except Exception as e:
        return e

    return HTTPException(status_code=status.HTTP_200_OK, detail="OTP resent successfully")


@router.post("/register/update-consumer", response_model=responseModels.ShowUser, status_code=status.HTTP_200_OK)
def update_user(request: schemas.RegisterConsumerUpdate, db: database.SessionDep) -> models.User:
    """Update user details"""
    user = db.get(models.User, request.phone_no)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.first_name = request.first_name
    user.last_name = request.last_name

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )

    return user


@router.post("/register/update-farmer", response_model=responseModels.ShowUser, status_code=status.HTTP_200_OK)
def update_farmer(request: schemas.RegisterFarmerUpdate, db: database.SessionDep) -> models.User:
    """Update farmer details"""
    user = db.get(models.User, request.phone_no)
    farmer = db.get(models.Farmer, request.phone_no)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.first_name = request.first_name
    user.last_name = request.last_name
    farmer.description = request.description

    try:
        db.add(user)
        db.add(farmer)
        db.commit()
        db.refresh(user)
        db.refresh(farmer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )

    return user


@router.post("/request-otp", status_code=status.HTTP_200_OK)
def request_otp(request: schemas.OTPRequest, db: database.SessionDep):
    try:
        OTPManager.generate_otp(otp_length=4, phone_no=request.phone_no, db=db)
    except Exception as e:
        return e

    return HTTPException(status_code=status.HTTP_200_OK, detail="OTP sent successfully")


@router.post("/login", response_model=responseModels.ShowUser, status_code=status.HTTP_200_OK)
def login(request: schemas.OTPVerificationRequest, db: database.SessionDep) -> models.User:
    """Login a user"""
    if OTPManager.verify_otp(phone_no=request.phone_no, otp=request.otp, db=db):
        user = db.get(models.User, request.phone_no)
        return user
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP",
        )

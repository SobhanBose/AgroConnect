from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlmodel import select
from uuid import UUID
import typing

from app.v1 import models
from app.v1.farmer import schemas, responseModels
from app.v1.utils.database import SessionDep

router = APIRouter(
    prefix="/farmer",
    tags=["farmer"],
)


@router.get("/{phone_no}", response_model=responseModels.ShowFarmer, status_code=status.HTTP_200_OK)
def get_farmer(phone_no: int, db: SessionDep) -> responseModels.ShowFarmer:
    """
    Get farmer details by phone number.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found",
        )

    if not farmer.user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer is not active",
        )

    return farmer


@router.get("/{phone_no}/produce", response_model=list[responseModels.ShowProduce], status_code=status.HTTP_200_OK)
def get_produce(phone_no: int, db: SessionDep) -> list[responseModels.ShowProduce]:
    """
    Get all produce for the farmer.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found",
        )

    if not farmer.user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer is not active",
        )

    try:
        # produces = db.exec(select(models.Produce).where(models.Produce.farmer_phone_no == phone_no)).all()
        produces = farmer.inventory
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )
    return produces


@router.post("/{phone_no}/add-produce", response_model=responseModels.ShowProduce, status_code=status.HTTP_201_CREATED)
def add_produce(phone_no: int, produce: schemas.ProduceCreate, db: SessionDep) -> responseModels.ShowProduce:
    """
    Add produce for the farmer.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found",
        )
    if not farmer.user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer is not active",
        )

    try:
        produce = models.Produce(**produce.model_dump(mode="json"), farmer_phone_no=phone_no)
        db.add(produce)
        db.commit()
        db.refresh(produce)
    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )

    return produce


@router.post("/{phone_no}/add-harvest", response_model=responseModels.ShowHarvest, status_code=status.HTTP_201_CREATED)
def add_harvest(phone_no: int, harvest: schemas.HarvestCreate, db: SessionDep) -> responseModels.ShowHarvest:
    """
    Add harvest for the farmer.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found",
        )
    if not farmer.user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer is not active",
        )

    produce = db.get(models.Produce, harvest.produce_id)
    if not produce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produce not found",
        )

    try:
        parsed_date = datetime.fromisoformat(harvest.harvest_date).date()
        if parsed_date > datetime.today().date():
            raise HTTPException(status_code=400, detail="Harvest date cannot be in the future.")

        harvest.harvest_date = parsed_date
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    existing_harvest = db.exec(select(models.Harvest).where(models.Harvest.produce_id == harvest.produce_id, models.Harvest.harvest_date == harvest.harvest_date)).first()
    if existing_harvest:
        existing_harvest.qty_harvested += harvest.qty_harvested
        try:
            db.add(existing_harvest)
            db.commit()
            db.refresh(existing_harvest)
        except Exception as e:
            print(e)
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error",
            )

        return existing_harvest

    existing_produce = db.exec(select(models.Produce).where(models.Produce.id == harvest.produce_id, models.Produce.farmer_phone_no == phone_no)).first()
    if existing_produce:
        existing_harvest = existing_produce.harvests
        for h in existing_harvest:
            h.rate = h.rate * (1 - (farmer.discount_percent / 100))
            db.add(h)

    try:
        harvest = models.Harvest(**harvest.model_dump())
        db.add(harvest)
        db.commit()
        db.refresh(harvest)
    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )

    return harvest


@router.get("/{phone_no}/harvest", response_model=dict[responseModels.ShowProduce, responseModels.ShowHarvest], status_code=status.HTTP_200_OK)
def get_harvest(phone_no: int, db: SessionDep) -> dict[responseModels.ShowProduce, responseModels.ShowHarvest]:
    """
    Get all harvest for the farmer.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found",
        )
    if not farmer.user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer is not active",
        )

    try:
        harvests = {produce: produce.harvest for produce in farmer.inventory}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )

    return harvests

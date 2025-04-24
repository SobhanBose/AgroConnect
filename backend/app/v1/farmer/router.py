from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from sqlmodel import select
from uuid import UUID
import typing
from geoalchemy2.shape import to_shape

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

    return responseModels.ShowFarmer(
        description=farmer.description,
        discount_percent=farmer.discount_percent,
        inventory=len(farmer.inventory),
        user=responseModels.ShowUser(phone_no=farmer.user.phone_no, first_name=farmer.user.first_name, last_name=farmer.user.last_name, latitude=to_shape(farmer.user.location).y if farmer.user.location else None, longitude=to_shape(farmer.user.location).x if farmer.user.location else None),
    )


# Handling produce


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
        produces = farmer.inventory
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching produce",
        )
    return produces


@router.get("/{phone_no}/produce/search", response_model=responseModels.ShowProduce, status_code=status.HTTP_200_OK)
def get_produce_by_name(phone_no: int, produce_name: str, db: SessionDep) -> responseModels.ShowProduce:
    """
    Get produce by name for the farmer.
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

    produce = db.exec(select(models.Produce).where(models.Produce.name == produce_name)).first()
    if not produce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produce not found",
        )

    return produce


@router.post("/{phone_no}/produce/add", response_model=responseModels.ShowProduce, status_code=status.HTTP_201_CREATED)
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
        existing_produce = db.exec(select(models.Produce).where(models.Produce.name == produce.name, models.Produce.farmer_phone_no == phone_no)).first()
        if existing_produce:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Produce with this name already exists.",
            )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while checking existing produce",
        )

    try:
        produce = models.Produce(**produce.model_dump(mode="json"), farmer_phone_no=phone_no)
        db.add(produce)
        db.commit()
        db.refresh(produce)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while adding produce",
        )

    return produce


@router.get("/{phone_no}/produce/{produce_id}", response_model=responseModels.ShowProduce, status_code=status.HTTP_200_OK)
def get_produce_by_id(phone_no: int, produce_id: str, db: SessionDep) -> responseModels.ShowProduce:
    """
    Get produce by ID for the farmer.
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

    produce = db.get(models.Produce, UUID(produce_id))
    if not produce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produce not found",
        )

    return produce


# Handling harvests


@router.get("/{phone_no}/harvest", response_model=list[responseModels.HarvestGrouped], status_code=status.HTTP_200_OK)
def get_harvest(phone_no: int, db: SessionDep) -> list[responseModels.HarvestGrouped]:
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
            detail="Farmer not active",
        )

    try:
        produces = db.exec(select(models.Produce).where(models.Produce.farmer_phone_no == phone_no)).all()
        grouped_harvests = []

        for produce in produces:
            harvests = sorted(produce.harvests, key=lambda h: h.harvest_date)

            if not harvests:
                continue

            grouped_harvests.append({"produce": produce, "harvests": harvests})

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching harvests",
        )

    return grouped_harvests


@router.get("/{phone_no}/harvest/search", response_model=responseModels.HarvestGrouped, status_code=status.HTTP_200_OK)
def get_harvest_by_produce_name(phone_no: int, produce_name: str, db: SessionDep) -> responseModels.HarvestGrouped:
    """
    Get all harvest for a specific produce for the farmer.
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
            detail="Farmer not active",
        )

    produce = db.exec(select(models.Produce).where(models.Produce.name == produce_name)).first()
    if not produce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produce not found",
        )

    try:
        harvests = sorted(produce.harvests, key=lambda h: h.harvest_date)

        harvest_grouped = {"produce": produce, "harvests": harvests}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching harvests",
        )

    return harvest_grouped


@router.post("/{phone_no}/harvest/add", response_model=responseModels.ShowHarvest, status_code=status.HTTP_201_CREATED)
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
            detail="Farmer not active",
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
        existing_harvest.qty_available += harvest.qty_harvested
        try:
            db.add(existing_harvest)
            db.commit()
            db.refresh(existing_harvest)
        except Exception as e:
            print(e)
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error while updating harvest",
            )

        return existing_harvest

    existing_produce = db.exec(select(models.Produce).where(models.Produce.id == harvest.produce_id, models.Produce.farmer_phone_no == phone_no)).first()
    if existing_produce:
        existing_harvest = existing_produce.harvests
        for h in existing_harvest:
            h.rate = h.rate * (1 - (farmer.discount_percent / 100))
            db.add(h)

    try:
        harvest = models.Harvest(**harvest.model_dump(), qty_available=harvest.qty_harvested)
        db.add(harvest)
        db.commit()
        db.refresh(harvest)
    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while adding harvest",
        )

    return harvest


@router.get("/{phone_no}/harvest/{produce_id}", response_model=responseModels.HarvestGrouped, status_code=status.HTTP_200_OK)
def get_harvest_by_produce(phone_no: int, produce_id: str, db: SessionDep) -> responseModels.HarvestGrouped:
    """
    Get all harvest for a specific produce for the farmer.
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
            detail="Farmer not active",
        )

    produce = db.get(models.Produce, UUID(produce_id))
    if not produce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produce not found",
        )

    try:
        harvests = sorted(produce.harvests, key=lambda h: h.harvest_date)

        harvest_grouped = {"produce": produce, "harvests": harvests}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching harvests",
        )

    return harvest_grouped


@router.get("/{phone_no}/harvest/{produce_id}/by-hdate", response_model=responseModels.HarvestGrouped, status_code=status.HTTP_200_OK)
def get_harvest_by_date(phone_no: int, produce_id: str, harvest_date: str, db: SessionDep) -> responseModels.HarvestGrouped:
    """
    Get all harvest for a specific produce for the farmer by date.
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
            detail="Farmer not active",
        )

    produce = db.get(models.Produce, UUID(produce_id))
    if not produce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produce not found",
        )

    try:
        harvests = db.exec(select(models.Harvest).where(models.Harvest.produce_id == produce.id, models.Harvest.harvest_date == harvest_date)).all()
        if not harvests:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No harvest found for the given date",
            )

        harvest_grouped = {"produce": produce, "harvests": harvests}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching harvests",
        )

    return harvest_grouped

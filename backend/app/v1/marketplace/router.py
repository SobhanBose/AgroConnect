from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlalchemy import func
from uuid import UUID
from typing import Literal

from app.v1.utils.database import SessionDep
from app.v1 import models
from app.v1.marketplace import schemas, responseModels
from app.v1.utils.enumerations import produceTag


router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[responseModels.ShowProduceMinimal])
def get_produce(db: SessionDep, phone_no: int, name: str | None = None, sortBy: Literal["rate", "harvestDate"] | None = None) -> list[responseModels.ShowProduceMinimal]:
    if not name:
        produces = db.exec(select(models.Produce)).all()
    else:
        produces = db.exec(select(models.Produce).where(models.Produce.name.contains(name))).all()

    if not produces:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="No produce found")

    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not user.location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User location not found")

    user_location = user.location
    distance = func.ST_Distance(models.User.location, user_location)

    stmt = select(models.Produce, distance.label("distance")).join(models.Farmer, models.Farmer.phone_no == models.Produce.farmer_phone_no).join(models.User, models.User.phone_no == models.Farmer.phone_no).where(models.User.location.isnot(None)).order_by(distance.asc())

    results = db.exec(stmt).all()

    produces = [result[0] for result in results]

    res = []
    for produce in produces:
        if produce.harvests:
            latest_harvest = max(produce.harvests, key=lambda h: h.harvest_date)
            res.append(responseModels.ShowProduceMinimal(id=produce.id, name=produce.name, image_path=produce.image_path, tag=produce.tag, farmer=produce.farmer, rate=latest_harvest.rate, harvest_date=latest_harvest.harvest_date))

    if sortBy is None:
        return res
    elif sortBy == "rate":
        return sorted(res, key=lambda x: x.rate)
    elif sortBy == "harvestDate":
        return sorted(res, key=lambda x: x.harvest_date)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid sortBy parameter")


@router.get("/filter-tag", status_code=status.HTTP_200_OK, response_model=list[responseModels.ShowProduceMinimal])
def get_produce_by_tag(tag: produceTag, db: SessionDep, sortBy: Literal["rate", "harvestDate"] | None = None) -> list[responseModels.ShowProduceMinimal]:
    produces = db.exec(select(models.Produce).where(models.Produce.tag == tag)).all()
    if not produces:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="No produce found with this tag")

    res = []
    for produce in produces:
        if produce.harvests:
            latest_harvest = max(produce.harvests, key=lambda h: h.harvest_date)
            res.append(responseModels.ShowProduceMinimal(id=produce.id, name=produce.name, image_path=produce.image_path, tag=produce.tag, rate=latest_harvest.rate, harvest_date=latest_harvest.harvest_date))

    if sortBy is None:
        return res
    elif sortBy == "rate":
        return sorted(res, key=lambda x: x.rate)
    elif sortBy == "harvestDate":
        return sorted(res, key=lambda x: x.harvest_date)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid sortBy parameter")


@router.get("/nearby/{phone_no}", status_code=status.HTTP_200_OK, response_model=list[responseModels.FarmerNearbyResponse])
def get_nearby_farmer(phone_no: int, db: SessionDep) -> list[responseModels.FarmerNearbyResponse]:
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user_location = user.location
    distance = func.ST_Distance(models.User.location, user_location)

    stmt = (
        select(models.User, models.Farmer, distance.label("distance"))
        .join(models.Farmer, models.Farmer.phone_no == models.User.phone_no)
        .where(models.User.phone_no != phone_no)  # Exclude self
        .where(models.User.location.isnot(None))
        .order_by(distance.asc())
    )

    results = db.exec(stmt).all()

    res = []
    for user, farmer, distance in results:
        if farmer.inventory:
            for produce in farmer.inventory:
                if produce.harvests:
                    res.append(responseModels.FarmerNearbyResponse(description=farmer.description, distance_km=distance / 1000, user=user))
                    break

    return res


@router.get("/{produce_id}", status_code=status.HTTP_200_OK, response_model=responseModels.HarvestGrouped)
def get_produce_harvests(produce_id: str, db: SessionDep) -> responseModels.HarvestGrouped:
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

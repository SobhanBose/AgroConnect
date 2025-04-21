from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from uuid import UUID
from typing import Literal

from app.v1.utils.database import SessionDep
from app.v1 import models
from app.v1.marketplace import schemas, responseModels


router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[responseModels.ShowProduceMinimal])
def get_produce(db: SessionDep, name: str | None = None, sortBy: Literal["rate", "harvestDate"] | None = None) -> list[responseModels.ShowProduceMinimal]:
    if not name:
        produces = db.exec(select(models.Produce)).all()
    else:
        produces = db.exec(select(models.Produce).where(models.Produce.name.contains(name))).all()

    if not produces:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="No produce found")

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
def get_produce_by_tag(tag: str, db: SessionDep, sortBy: Literal["rate", "harvestDate"] | None = None) -> list[responseModels.ShowProduceMinimal]:
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

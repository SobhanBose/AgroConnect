from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from uuid import UUID
from datetime import date

from app.v1 import models
from app.v1.utils.database import SessionDep
from app.v1.utils import enumerations as enums
from app.v1.orders import schemas, responseModels

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post("/consumer/save_transaction/{order_id}", response_model=responseModels.HTTPExceptionResponse, status_code=status.HTTP_200_OK)
def save_transaction(order_id: str, transaction_request: schemas.TransactionCreate, db: SessionDep) -> responseModels.HTTPExceptionResponse:
    """
    Save transaction details for an order.
    """
    order = db.get(models.Order, UUID(order_id))

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    try:
        transaction = models.Transaction(**transaction_request.model_dump(mode="json"), transaction_date=date.today())
        db.add(transaction)
        db.flush()  # Use flush to get the transaction ID before committing

        order.transaction_id = transaction.id
        db.add(order)

        db.commit()
        db.refresh(transaction)
        db.refresh(order)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error saving transaction")

    return HTTPException(status_code=status.HTTP_200_OK, detail="Transaction saved successfully")


@router.get("/consumer/{phone_no}", response_model=list[responseModels.ShowOrderMinimal], status_code=status.HTTP_200_OK)
def get_orders(phone_no: int, db: SessionDep) -> list[responseModels.ShowOrderMinimal]:
    """
    Get all orders for a user.
    """
    orders = db.exec(select(models.Order).where(models.Order.consumer_phone_no == phone_no)).all()

    if not orders:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No orders found")
    return orders


@router.post("/consumer/{phone_no}", response_model=responseModels.ShowOrder, status_code=status.HTTP_201_CREATED)
def create_order(phone_no: int, order_request: schemas.OrderCreate, db: SessionDep) -> responseModels.ShowOrder:
    """
    Create a new order for a user.
    """
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    cart = user.cart
    if not cart:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart not found")

    order = models.Order(**order_request.model_dump(mode="json"), consumer_phone_no=phone_no, order_date=date.today(), total_amount=cart.total_amount, delivery_charges=30.0)

    if order_request.payment_mode == enums.paymentMode.pod:
        transaction = models.Transaction(mode=enums.transactionMode.pod, utr="NA", order_id=order.id, amount=cart.total_amount, transaction_status=enums.transactionStatus.success, transaction_date=date.today())
        db.add(transaction)
        db.flush()  # Use flush to get the transaction ID before committing
        order.transaction_id = transaction.id

    db.add(order)
    db.flush()  # Use flush to get the order ID before committing

    order_items = [
        models.OrderItems(
            harvest_id=item.harvest_id,
            qty=item.qty,
            rate=item.rate,
            order_id=order.id,
        )
        for item in cart.cart_items
    ]
    db.add_all(order_items)

    for cart_item in cart.cart_items:
        db.delete(cart_item)

    cart.total_amount = 0.0
    db.add(cart)

    try:
        db.commit()
        db.refresh(order)
        db.refresh(cart)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating order")

    return order


@router.get("/consumer/{phone_no}/{order_id}", response_model=responseModels.ShowOrder)
def get_order_by_order_id(phone_no: int, order_id: str, db: SessionDep) -> responseModels.ShowOrder:
    """
    Get a specific order for a user.
    """
    user: models.User = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    order = db.get(models.Order, UUID(order_id))

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return order


@router.post("/consumer/{phone_no}/{order_id}/cancel", response_model=responseModels.HTTPExceptionResponse, status_code=status.HTTP_200_OK)
def cancel_order(phone_no: int, order_id: str, db: SessionDep) -> responseModels.HTTPExceptionResponse:
    """
    Cancel an order for a user.
    """
    user: models.User = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    order = db.get(models.Order, UUID(order_id))

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.order_status == enums.orderStatus.cancelled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order already cancelled")

    if order.order_status == enums.orderStatus.completed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order already completed")

    if order.order_status == enums.orderStatus.packed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order cannot be cancelled after packing")

    order.order_status = enums.orderStatus.cancelled
    order_items = order.order_items
    for item in order_items:
        harvest = db.get(models.Harvest, item.harvest_id)
        if harvest:
            harvest.qty_available += item.qty
            db.add(harvest)

    db.commit()

    return HTTPException(status_code=status.HTTP_200_OK, detail="Order cancelled successfully")


@router.get("/farmer/{phone_no}", response_model=list[responseModels.OrderDetailsGrouped], status_code=status.HTTP_200_OK)
def get_farmer_orders(phone_no: int, db: SessionDep) -> list[responseModels.OrderDetailsGrouped]:
    """
    Get all orders for a farmer.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")

    orders = db.exec(select(models.Order).join(models.Order.order_items).join(models.OrderItems.harvest).join(models.Harvest.produce).where(models.Produce.farmer_phone_no == phone_no).distinct()).all()

    grouped_orders = [
        responseModels.OrderDetailsGrouped(
            order=responseModels.ShowOrderMinimal.model_validate(order),
            order_items=[responseModels.ShowOrderItems.model_validate(item) for item in order.order_items if item.harvest.produce.farmer_phone_no == phone_no],
        )
        for order in orders
    ]

    return grouped_orders


@router.get("/farmer/{phone_no}/filter/", response_model=list[responseModels.OrderDetailsGrouped], status_code=status.HTTP_200_OK)
def get_farmer_orders_filtered(phone_no: int, order_status: enums.orderStatus, db: SessionDep) -> list[responseModels.OrderDetailsGrouped]:
    """
    Get a specific order for a farmer.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")

    orders = db.exec(select(models.Order).join(models.Order.order_items).join(models.OrderItems.harvest).join(models.Harvest.produce).where(models.Produce.farmer_phone_no == phone_no, models.Order.order_status == order_status).distinct()).all()

    grouped_orders = [
        responseModels.OrderDetailsGrouped(
            order=responseModels.ShowOrderMinimal.model_validate(order),
            order_items=[responseModels.ShowOrderItems.model_validate(item) for item in order.order_items if item.harvest.produce.farmer_phone_no == phone_no],
        )
        for order in orders
    ]

    return grouped_orders


@router.post("/farmer/{phone_no}/{order_id}/pack", response_model=responseModels.HTTPExceptionResponse, status_code=status.HTTP_200_OK)
def pack_order(phone_no: int, order_id: str, db: SessionDep) -> responseModels.HTTPExceptionResponse:
    """
    Pack an order for a farmer.
    """
    farmer = db.get(models.Farmer, phone_no)
    if not farmer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer not found")

    order = db.get(models.Order, UUID(order_id))

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.order_status == enums.orderStatus.packed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order already packed")

    if order.order_status == enums.orderStatus.completed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order already completed")

    if order.order_status == enums.orderStatus.cancelled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order cannot be packed after cancellation")

    order.order_status = enums.orderStatus.packed
    db.add(order)

    db.commit()
    db.refresh(order)

    return HTTPException(status_code=status.HTTP_200_OK, detail="Order packed successfully")

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


@router.post("/{phone_no}/cart", response_model=responseModels.ShowCart, status_code=status.HTTP_201_CREATED)
def create_cart(phone_no: int, db: SessionDep) -> responseModels.ShowCart:
    """
    Create a new cart for the user.
    """
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.cart:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart already exists",
        )

    cart = models.Cart(consumer_phone_no=phone_no, total_amount=0)
    try:
        db.add(cart)
        db.commit()
        db.refresh(cart)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while creating cart",
        )

    return cart


@router.get("/{phone_no}/cart", response_model=responseModels.ShowCart, status_code=status.HTTP_200_OK)
def get_cart(phone_no: int, db: SessionDep) -> responseModels.ShowCart:
    """
    Get the user's cart.
    """
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    cart = user.cart
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found",
        )

    return cart


@router.delete("/{phone_no}/cart", response_model=responseModels.HTTPExceptionResponse, status_code=status.HTTP_200_OK)
def delete_cart(phone_no: int, db: SessionDep) -> responseModels.HTTPExceptionResponse:
    """
    Delete the user's cart.
    """
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    cart = user.cart
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found",
        )

    cart_items = cart.cart_items
    try:
        for item in cart_items:
            item.harvest.qty_available += item.qty
            db.add(item.harvest)
            db.delete(item)
        db.delete(cart)
        db.commit()
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while deleting cart",
        )

    return HTTPException(status_code=status.HTTP_200_OK, detail="Cart deleted successfully")


@router.post("/{phone_no}/cart/add", response_model=responseModels.ShowCart, status_code=status.HTTP_201_CREATED)
def add_to_cart(phone_no: int, addToCartRequest: schemas.CartItemCreate, db: SessionDep) -> responseModels.ShowCart:
    """
    Add an item to the user's cart.
    """
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    cart = user.cart
    if not cart:
        cart = models.Cart(consumer_phone_no=phone_no, total_amount=0)
        db.add(cart)

    harvest = db.get(models.Harvest, addToCartRequest.harvest_id)
    if not harvest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Harvest not found",
        )

    if harvest.qty_available < addToCartRequest.qty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requested quantity exceeds available harvest quantity",
        )

    try:
        cart_item = models.CartItem(
            cart_id=cart.id,
            harvest_id=addToCartRequest.harvest_id,
            qty=addToCartRequest.qty,
            rate=harvest.rate,
        )

        cart.total_amount += cart_item.qty * cart_item.rate
        harvest.qty_available -= cart_item.qty

        db.add(cart_item)
        db.add(cart)
        db.add(harvest)
        db.commit()
        db.refresh(cart_item)
        db.refresh(cart)
        db.refresh(harvest)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while adding item to cart",
        )

    return cart


@router.patch("/{phone_no}/cart/{cart_item_id}", response_model=responseModels.ShowCart, status_code=status.HTTP_200_OK)
def update_cart_item(phone_no: int, cart_item_id: str, updateCartItemRequest: schemas.CartItemUpdate, db: SessionDep) -> responseModels.ShowCart:
    """
    Update an item in the user's cart.
    """
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    cart = user.cart
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found",
        )

    cart_item = db.get(models.CartItem, UUID(cart_item_id))
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    if cart_item.harvest.qty_available + cart_item.qty < updateCartItemRequest.qty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requested quantity exceeds available harvest quantity",
        )

    try:
        if updateCartItemRequest.qty == 0:
            cart_item.harvest.qty_available += cart_item.qty
            cart.total_amount -= cart_item.qty * cart_item.rate
            db.delete(cart_item)
            db.add(cart_item.harvest)
        else:
            cart_item.harvest.qty_available += cart_item.qty - updateCartItemRequest.qty
            cart.total_amount -= cart_item.qty * cart_item.rate
            cart_item.qty = updateCartItemRequest.qty
            cart.total_amount += cart_item.qty * cart_item.rate
            db.add(cart_item)
            db.add(cart_item.harvest)

        db.add(cart)
        db.commit()
        db.refresh(cart)
        if updateCartItemRequest.qty != 0:
            db.refresh(cart_item)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while updating item in cart",
        )

    return cart


@router.delete("/{phone_no}/cart/{cart_item_id}", response_model=responseModels.ShowCart, status_code=status.HTTP_200_OK)
def delete_cart_item(phone_no: int, cart_item_id: str, db: SessionDep) -> responseModels.ShowCart:
    """
    Delete an item from the user's cart.
    """
    user = db.get(models.User, phone_no)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    cart = user.cart
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found",
        )

    cart_item = db.get(models.CartItem, UUID(cart_item_id))
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    try:
        cart_item.harvest.qty_available += cart_item.qty
        cart.total_amount -= cart_item.qty * cart_item.rate
        db.delete(cart_item)
        db.add(cart)
        db.add(cart_item.harvest)
        db.commit()
        db.refresh(cart)
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while deleting item from cart",
        )

    return cart

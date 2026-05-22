"""
Cart routes: /api/v1/cart/*

All routes are protected — require a valid Bearer token.
user_id is always taken from the JWT, never from the request body.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.cart import (
    CartItemAddRequest,
    CartItemUpdateRequest,
    CartItemResponse,
    CartSummaryResponse,
)
from app.services import cart_service
from app.utils.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=CartSummaryResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = cart_service.get_cart_items(db, user_id=current_user.id)
    return cart_service.build_cart_summary(items)


@router.post("", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: CartItemAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return cart_service.add_to_cart(db, payload, user_id=current_user.id)


@router.patch("/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return cart_service.update_cart_item(db, item_id, payload, user_id=current_user.id)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart_service.remove_cart_item(db, item_id, user_id=current_user.id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart_service.clear_cart(db, user_id=current_user.id)
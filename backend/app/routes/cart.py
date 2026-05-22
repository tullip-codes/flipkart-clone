# FILE: backend/app/routes/cart.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.cart import (
    CartItemAddRequest,
    CartItemUpdateRequest,
    CartItemResponse,
    CartSummaryResponse,
)
from app.services import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("", response_model=CartSummaryResponse)
def get_cart(db: Session = Depends(get_db)):
    """Return full cart with calculated summary for the guest user."""
    items = cart_service.get_cart_items(db)
    return cart_service.build_cart_summary(items)


@router.post("", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(payload: CartItemAddRequest, db: Session = Depends(get_db)):
    """Add a product to cart. If it already exists, increments quantity."""
    return cart_service.add_to_cart(db, payload)


@router.patch("/{item_id}", response_model=CartItemResponse)
def update_cart_item(item_id: int, payload: CartItemUpdateRequest, db: Session = Depends(get_db)):
    """Update quantity of a specific cart item."""
    return cart_service.update_cart_item(db, item_id, payload)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(item_id: int, db: Session = Depends(get_db)):
    """Remove a single item from the cart."""
    cart_service.remove_cart_item(db, item_id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(db: Session = Depends(get_db)):
    """Remove all items from the cart."""
    cart_service.clear_cart(db)
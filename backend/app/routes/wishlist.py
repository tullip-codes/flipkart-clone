"""
Wishlist routes: /api/v1/wishlist/*

All routes are protected — requires valid JWT.
Thin route handlers; all logic lives in wishlist_service.

Endpoints:
  GET    /wishlist           — get current user's wishlist
  POST   /wishlist/toggle    — add or remove a product (toggle)
  DELETE /wishlist/{item_id} — remove by wishlist item id
  GET    /wishlist/ids       — returns list of wishlisted product_ids (for UI state)
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.wishlist import WishlistResponse, WishlistToggleResponse
from app.services.wishlist_service import (
    get_wishlist,
    get_wishlisted_product_ids,
    remove_from_wishlist,
    toggle_wishlist,
)
from app.utils.auth import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=WishlistResponse)
def get_wishlist_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_wishlist(current_user, db)


@router.post("/toggle", response_model=WishlistToggleResponse, status_code=200)
def toggle_wishlist_route(
    payload: dict,          # {"product_id": int}
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product_id = payload.get("product_id")
    if not isinstance(product_id, int):
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail="product_id must be an integer")
    return toggle_wishlist(product_id, current_user, db)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_wishlist_item_route(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    remove_from_wishlist(item_id, current_user, db)


@router.get("/ids", response_model=list[int])
def get_wishlist_ids_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_wishlisted_product_ids(current_user, db)
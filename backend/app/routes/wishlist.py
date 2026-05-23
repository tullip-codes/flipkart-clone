from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.wishlist import (
    WishlistResponse,
    WishlistToggleRequest,        # ← add
    WishlistToggleResponse,
)
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
    payload: WishlistToggleRequest,    # ← fixed: no more bare dict
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return toggle_wishlist(payload.product_id, current_user, db)


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
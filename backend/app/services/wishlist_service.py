"""
Wishlist business logic.

Follows the exact same service-layer pattern as cart_service.py:
- All DB logic here, routes stay thin.
- get_current_user dependency handles auth — service receives
  the already-validated user object.
"""

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.wishlist import WishlistItem
from app.models.user import User
from app.schemas.wishlist import WishlistResponse, WishlistToggleResponse


def get_wishlist(user: User, db: Session) -> WishlistResponse:
    """Return all wishlist items for the current user, newest first."""
    items = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )
    return WishlistResponse(items=items, total=len(items))


def toggle_wishlist(product_id: int, user: User, db: Session) -> WishlistToggleResponse:
    """
    Add if not present, remove if already present.
    Returns wishlisted=True when added, False when removed.
    Using toggle avoids two round-trips from the frontend.
    """
    # Validate product exists
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True,
    ).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == user.id,
        WishlistItem.product_id == product_id,
    ).first()

    if existing:
        # Already wishlisted → remove
        db.delete(existing)
        db.commit()
        return WishlistToggleResponse(
            wishlisted=False,
            product_id=product_id,
            message="Removed from wishlist",
        )

    # Not yet wishlisted → add
    try:
        item = WishlistItem(user_id=user.id, product_id=product_id)
        db.add(item)
        db.commit()
    except IntegrityError:
        # Race condition: another request already inserted — treat as success
        db.rollback()

    return WishlistToggleResponse(
        wishlisted=True,
        product_id=product_id,
        message="Added to wishlist",
    )


def remove_from_wishlist(item_id: int, user: User, db: Session) -> None:
    """
    Remove a specific wishlist item by its row ID.
    Ownership check: user can only remove their own items.
    """
    item = db.query(WishlistItem).filter(
        WishlistItem.id == item_id,
        WishlistItem.user_id == user.id,
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found",
        )

    db.delete(item)
    db.commit()


def get_wishlisted_product_ids(user: User, db: Session) -> list[int]:
    """
    Returns a flat list of product_ids in the user's wishlist.
    Used by the frontend to know which heart buttons to fill.
    """
    rows = (
        db.query(WishlistItem.product_id)
        .filter(WishlistItem.user_id == user.id)
        .all()
    )
    return [r.product_id for r in rows]
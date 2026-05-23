"""
Pydantic schemas for Wishlist.

WishlistItemResponse embeds the full ProductCard snapshot so the
frontend never needs a second request to render the wishlist page.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Embedded product snapshot — mirrors ProductCard on the frontend
class WishlistProductSnapshot(BaseModel):
    id: int
    title: str
    brand: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percent: float
    image_url: Optional[str] = None
    rating: float
    rating_count: int
    stock: int

    model_config = {"from_attributes": True}


class WishlistItemResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    product: WishlistProductSnapshot
    created_at: datetime

    model_config = {"from_attributes": True}


class WishlistResponse(BaseModel):
    items: list[WishlistItemResponse]
    total: int

    model_config = {"from_attributes": True}


class WishlistToggleResponse(BaseModel):
    """Returned by the toggle endpoint — client uses `wishlisted` to update UI."""
    wishlisted: bool
    product_id: int
    message: str
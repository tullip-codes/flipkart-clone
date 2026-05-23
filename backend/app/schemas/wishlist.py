from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class WishlistToggleRequest(BaseModel):        
    product_id: int


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
    wishlisted: bool
    product_id: int
    message: str
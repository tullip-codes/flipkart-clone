from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Nested product snapshot inside a cart item response 

class CartProductSnapshot(BaseModel):
    id: int
    title: str
    brand: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percent: float
    image_url: Optional[str] = None
    stock: int

    class Config:
        from_attributes = True


# Request bodies 

class CartItemAddRequest(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(default=1, ge=1, le=10)  # max 10 per item


class CartItemUpdateRequest(BaseModel):
    quantity: int = Field(..., ge=1, le=10)


# Response shapes 

class CartItemResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    product: CartProductSnapshot
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CartSummaryResponse(BaseModel):
    items: list[CartItemResponse]
    item_count: int          # total distinct products
    total_quantity: int      # sum of all quantities
    subtotal: float          # sum of (price * qty)
    total_discount: float    # sum of savings
    total: float             # subtotal after discount (= sum of price * qty, price is already discounted)
    delivery_charge: float   # 0 if subtotal >= 500, else 40
    grand_total: float       # total + delivery_charge
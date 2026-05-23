from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.order import OrderStatus


# Shipping Address 

class ShippingAddress(BaseModel):
    full_name: str  = Field(..., min_length=2, max_length=100)
    phone:     str  = Field(..., min_length=10, max_length=15)
    address:   str  = Field(..., min_length=5, max_length=300)
    city:      str  = Field(..., min_length=2, max_length=100)
    state:     str  = Field(..., min_length=2, max_length=100)
    pincode:   str  = Field(..., min_length=6, max_length=10)


# Request 

class PlaceOrderRequest(BaseModel):
    shipping_address: ShippingAddress
    payment_method:   str = Field(default="cod", pattern="^(cod|upi|card)$")


# Response

class OrderItemResponse(BaseModel):
    id:          int
    product_id:  Optional[int]
    title:       str
    image_url:   Optional[str]
    brand:       Optional[str]
    unit_price:  float
    quantity:    int
    total_price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id:               int
    order_number:     str
    status:           OrderStatus
    subtotal:         float
    total_discount:   float
    delivery_charge:  float
    grand_total:      float
    shipping_address: str        # raw JSON string — parsed on frontend
    payment_method:   str
    items:            list[OrderItemResponse]
    created_at:       datetime
    updated_at:       Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    orders: list[OrderResponse]
    total:  int
"""
Order + OrderItem models.

Design decisions:
- ShippingAddress stored as JSON text column — avoids an extra table for a simple struct.
- OrderItem snapshots title + unit_price at purchase time — prices can change, history must not.
- order_number is human-readable (FK-timestamp-random) for display; id is the PK for joins.
"""

import enum
import uuid
import time
import random

from sqlalchemy import (
    Column, Integer, String, Float, Text,
    DateTime, ForeignKey, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class OrderStatus(str, enum.Enum):
    PENDING   = "pending"
    CONFIRMED = "confirmed"
    SHIPPED   = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


def generate_order_number() -> str:
    """FK-<unix_ms>-<4 random digits>  e.g. FK-1716023445123-4892"""
    ts = int(time.time() * 1000)
    rand = random.randint(1000, 9999)
    return f"FK-{ts}-{rand}"


class Order(Base):
    __tablename__ = "orders"

    id             = Column(Integer, primary_key=True, index=True)
    order_number   = Column(String(50), unique=True, index=True, nullable=False, default=generate_order_number)

    user_id        = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Financials — mirrored from cart summary at checkout time
    subtotal       = Column(Float, nullable=False)
    total_discount = Column(Float, default=0.0)
    delivery_charge= Column(Float, default=0.0)
    grand_total    = Column(Float, nullable=False)

    # Shipping address stored as JSON string — simple, no extra table
    shipping_address = Column(Text, nullable=False)   # JSON: {name, phone, address, city, state, pincode}

    payment_method = Column(String(50), default="cod")  # cod | upi | card
    status         = Column(SAEnum(OrderStatus), default=OrderStatus.CONFIRMED, nullable=False)

    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user  = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Order(id={self.id}, number={self.order_number}, status={self.status})>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id         = Column(Integer, primary_key=True, index=True)
    order_id   = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)

    # Snapshot at purchase time — immutable history
    title      = Column(String(300), nullable=False)
    image_url  = Column(String(500), nullable=True)
    brand      = Column(String(100), nullable=True)
    unit_price = Column(Float, nullable=False)
    quantity   = Column(Integer, nullable=False)
    total_price= Column(Float, nullable=False)   # unit_price * quantity

    # Relationship back to order
    order   = relationship("Order", back_populates="items")
    product = relationship("Product", lazy="joined")

    def __repr__(self) -> str:
        return f"<OrderItem(order_id={self.order_id}, product={self.title!r}, qty={self.quantity})>"
"""
Order service — all business logic for checkout and order history.

Integration points:
- Reads cart via cart_service.get_cart_items (reuses existing logic)
- Clears cart via cart_service.clear_cart after successful placement
- Snapshots product data into OrderItems so history is immutable
"""

import json
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.order import Order, OrderItem, generate_order_number, OrderStatus
from app.models.cart import CartItem
from app.schemas.order import PlaceOrderRequest, OrderResponse, OrderListResponse
from app.services.cart_service import (
    get_cart_items,
    build_cart_summary,
    clear_cart,
    FREE_DELIVERY_THRESHOLD,
    DELIVERY_CHARGE,
)


def place_order(db: Session, payload: PlaceOrderRequest, user_id: int) -> Order:
    # 1. Load cart
    items: list[CartItem] = get_cart_items(db, user_id=user_id)
    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot place order with an empty cart."
        )

    # 2. Calculate totals — reuse cart_service logic exactly
    summary = build_cart_summary(items)

    # 3. Create Order row
    order = Order(
        user_id         = user_id,
        order_number    = generate_order_number(),
        subtotal        = summary.subtotal,
        total_discount  = summary.total_discount,
        delivery_charge = summary.delivery_charge,
        grand_total     = summary.grand_total,
        shipping_address= json.dumps(payload.shipping_address.model_dump()),
        payment_method  = payload.payment_method,
        status          = OrderStatus.CONFIRMED,
    )
    db.add(order)
    db.flush()   # get order.id without committing yet

    # 4. Snapshot each cart item into OrderItem
    for cart_item in items:
        p = cart_item.product
        order_item = OrderItem(
            order_id   = order.id,
            product_id = p.id,
            title      = p.title,
            image_url  = p.image_url,
            brand      = p.brand,
            unit_price = p.price,
            quantity   = cart_item.quantity,
            total_price= round(p.price * cart_item.quantity, 2),
        )
        db.add(order_item)

    # 5. Clear cart — atomic with order creation
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    # 6. Single commit — all or nothing
    db.commit()
    db.refresh(order)
    return order


def get_order_by_id(db: Session, order_id: int, user_id: int) -> Order:
    order = db.query(Order).filter(
        Order.id      == order_id,
        Order.user_id == user_id,
    ).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found."
        )
    return order


def get_order_by_number(db: Session, order_number: str, user_id: int) -> Order:
    order = db.query(Order).filter(
        Order.order_number == order_number,
        Order.user_id      == user_id,
    ).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found."
        )
    return order


def get_user_orders(db: Session, user_id: int) -> OrderListResponse:
    orders = (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return OrderListResponse(orders=orders, total=len(orders))
"""
Order routes: /api/v1/orders/*

All routes protected — require valid Bearer token.

Email is sent via BackgroundTasks — fire and forget after response.
This keeps place_order synchronous (safe with SQLAlchemy sync sessions)
while still sending the email without blocking the response.
"""

import asyncio
from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.order import PlaceOrderRequest, OrderResponse, OrderListResponse
from app.services import order_service
from app.services.email_service import send_order_confirmation
from app.utils.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


def _send_email_background(order, user_email: str, user_full_name: str):
    """Sync wrapper that runs the async email function in a new event loop."""
    try:
        asyncio.run(send_order_confirmation(
            order=order,
            user_email=user_email,
            user_full_name=user_full_name,
        ))
    except Exception as e:
        import logging
        logging.getLogger(__name__).error("Background email error: %s", e)


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    payload: PlaceOrderRequest,
    background_tasks: BackgroundTasks,            # ← add
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    """Convert cart into a confirmed order, clear cart, send confirmation email."""

    # 1. Place order — sync DB work, unchanged
    order = order_service.place_order(db, payload, user_id=current_user.id)

    # 2. Send email in background — never blocks response, never breaks order
    background_tasks.add_task(
        _send_email_background,
        order,
        current_user.email,
        current_user.full_name,
    )

    return order


@router.get("", response_model=OrderListResponse)
def get_my_orders(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    return order_service.get_user_orders(db, user_id=current_user.id)


@router.get("/{order_number}", response_model=OrderResponse)
def get_order(
    order_number: str,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    return order_service.get_order_by_number(db, order_number, user_id=current_user.id)
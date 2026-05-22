"""
Order routes: /api/v1/orders/*

All routes protected — require valid Bearer token.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.order import PlaceOrderRequest, OrderResponse, OrderListResponse
from app.services import order_service
from app.utils.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    payload: PlaceOrderRequest,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    """Convert cart into a confirmed order and clear the cart."""
    return order_service.place_order(db, payload, user_id=current_user.id)


@router.get("", response_model=OrderListResponse)
def get_my_orders(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    """Get all orders for the current user, newest first."""
    return order_service.get_user_orders(db, user_id=current_user.id)


@router.get("/{order_number}", response_model=OrderResponse)
def get_order(
    order_number: str,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    """Get a single order by order number."""
    return order_service.get_order_by_number(db, order_number, user_id=current_user.id)
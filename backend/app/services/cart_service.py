from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemAddRequest, CartItemUpdateRequest, CartSummaryResponse


GUEST_USER_ID = 1         
FREE_DELIVERY_THRESHOLD = 500.0
DELIVERY_CHARGE = 40.0


def _get_product_or_404(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found or unavailable."
        )
    return product


def get_cart_items(db: Session, user_id: int = GUEST_USER_ID) -> list[CartItem]:
    return (
        db.query(CartItem)
        .filter(CartItem.user_id == user_id)
        .order_by(CartItem.created_at.desc())
        .all()
    )


def add_to_cart(db: Session, payload: CartItemAddRequest, user_id: int = GUEST_USER_ID) -> CartItem:
    product = _get_product_or_404(db, payload.product_id)

    # Guard: check stock
    if product.stock < payload.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {product.stock} units available."
        )

    # If item already exists, increment quantity instead of duplicating
    existing = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == payload.product_id
    ).first()

    if existing:
        new_qty = existing.quantity + payload.quantity
        if new_qty > 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 10 units per item allowed."
            )
        if new_qty > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock} units available."
            )
        existing.quantity = new_qty
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = CartItem(
        user_id=user_id,
        product_id=payload.product_id,
        quantity=payload.quantity
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


def update_cart_item(
    db: Session, item_id: int, payload: CartItemUpdateRequest, user_id: int = GUEST_USER_ID
) -> CartItem:
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == user_id
    ).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found.")

    product = _get_product_or_404(db, item.product_id)
    if payload.quantity > product.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {product.stock} units available."
        )

    item.quantity = payload.quantity
    db.commit()
    db.refresh(item)
    return item


def remove_cart_item(db: Session, item_id: int, user_id: int = GUEST_USER_ID) -> None:
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == user_id
    ).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found.")

    db.delete(item)
    db.commit()


def clear_cart(db: Session, user_id: int = GUEST_USER_ID) -> None:
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()


def build_cart_summary(items: list[CartItem]) -> CartSummaryResponse:
    """
    Pure calculation — no DB calls.
    price on Product is already the discounted/final price.
    original_price is the MRP shown with strikethrough.
    """
    subtotal = sum(item.product.price * item.quantity for item in items)
    total_discount = sum(
        ((item.product.original_price or item.product.price) - item.product.price) * item.quantity
        for item in items
    )
    delivery_charge = 0.0 if subtotal >= FREE_DELIVERY_THRESHOLD else DELIVERY_CHARGE
    grand_total = subtotal + delivery_charge

    return CartSummaryResponse(
        items=items,
        item_count=len(items),
        total_quantity=sum(item.quantity for item in items),
        subtotal=round(subtotal, 2),
        total_discount=round(total_discount, 2),
        total=round(subtotal, 2),
        delivery_charge=delivery_charge,
        grand_total=round(grand_total, 2),
    )
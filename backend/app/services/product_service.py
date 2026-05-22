"""
Product service layer.

Encapsulates all database interactions for products so that route handlers
stay thin.  All query composition lives here, making unit-testing trivial.
"""

import math
from typing import Optional

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func

from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductUpdate


# Read operations

def get_products(
    db: Session,
    *,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = "created_at",
    order: str = "desc",
    page: int = 1,
    page_size: int = 20,
):
    """
    Return a paginated, filtered, sorted slice of active products.

    Joining category eagerly avoids N+1 on serialisation.
    """
    query = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.is_active == True)  # noqa: E712
    )

    # Filters 
    if search:
        term = f"%{search.lower()}%"
        query = query.filter(
            or_(
                func.lower(Product.title).like(term),
                func.lower(Product.brand).like(term),
            )
        )

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Sorting 
    allowed_sort_fields = {
        "created_at": Product.created_at,
        "price": Product.price,
        "rating": Product.rating,
        "discount_percent": Product.discount_percent,
    }
    sort_col = allowed_sort_fields.get(sort_by, Product.created_at)
    query = query.order_by(sort_col.desc() if order == "desc" else sort_col.asc())

    # Pagination 
    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total else 1,
    }


def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.id == product_id, Product.is_active == True)  # noqa: E712
        .first()
    )


def get_featured_products(db: Session, limit: int = 8) -> list[Product]:
    """Top-rated active products for the homepage featured section."""
    return (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.is_active == True)  # noqa: E712
        .order_by(Product.rating.desc())
        .limit(limit)
        .all()
    )


# Write operations

def create_product(db: Session, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(
    db: Session, product_id: int, data: ProductUpdate
) -> Optional[Product]:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> bool:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return False
    product.is_active = False   # soft delete
    db.commit()
    return True
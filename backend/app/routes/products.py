"""
Products router.

Route handlers are intentionally thin — all business logic lives in the
service layer.  This keeps routes readable and testable independently.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.product import (
    ProductCardResponse,
    ProductDetailResponse,
    ProductListResponse,
    ProductCreate,
)
from app.services import product_service

router = APIRouter(prefix="/products", tags=["Products"])


#  GET /products 

@router.get("", response_model=ProductListResponse)
def list_products(
    search: Optional[str] = Query(None, description="Search by title or brand"),
    category_id: Optional[int] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    sort_by: str = Query("created_at", enum=["created_at", "price", "rating", "discount_percent"]),
    order: str = Query("desc", enum=["asc", "desc"]),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    result = product_service.get_products(
        db,
        search=search,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        order=order,
        page=page,
        page_size=page_size,
    )
    return result


# GET /products/featured 

@router.get("/featured", response_model=list[ProductCardResponse])
def get_featured_products(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Returns top-rated products for the homepage hero section."""
    return product_service.get_featured_products(db, limit=limit)


# GET /products/{product_id} 
@router.get("/{product_id}", response_model=ProductDetailResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = product_service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found.",
        )
    return product


# POST /products (admin / seeding convenience)

@router.post("", response_model=ProductDetailResponse, status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    return product_service.create_product(db, data)
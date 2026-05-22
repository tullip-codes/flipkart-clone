from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional, List
import json

from app.schemas.category import CategoryResponse


# Shared base 
class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    brand: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percent: float = 0.0
    stock: int = 0
    is_active: bool = True
    image_url: Optional[str] = None
    images: List[str] = []
    rating: float = 0.0
    rating_count: int = 0
    specifications: Optional[str] = None   
    category_id: Optional[int] = None


# Write schemas 

class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    """All fields optional for PATCH semantics."""
    title: Optional[str] = None
    description: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    discount_percent: Optional[float] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    rating: Optional[float] = None
    rating_count: Optional[int] = None
    specifications: Optional[str] = None
    category_id: Optional[int] = None


# Read schemas 
class ProductCardResponse(BaseModel):
    """Lightweight projection used for listing/grid views."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    brand: Optional[str]
    price: float
    original_price: Optional[float]
    discount_percent: float
    image_url: Optional[str]
    rating: float
    rating_count: int
    stock: int
    category: Optional[CategoryResponse] = None


class ProductDetailResponse(ProductBase):
    """Full projection used for the detail page."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: Optional[CategoryResponse] = None
    created_at: datetime

    @field_validator("specifications", mode="before")
    @classmethod
    def parse_specs(cls, v):
        """Return raw string as-is; frontend parses JSON."""
        return v


# Paginated list wrapper

class ProductListResponse(BaseModel):
    items: List[ProductCardResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
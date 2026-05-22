from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    DateTime, Float, ForeignKey, ARRAY
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    # Core fields
    title = Column(String(300), nullable=False, index=True)
    description = Column(Text, nullable=True)
    brand = Column(String(100), nullable=True, index=True)

    # Pricing
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)  
    discount_percent = Column(Float, default=0.0)   
    # Inventory
    stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    # Media — primary image + additional images stored as a list of URLs
    image_url = Column(String(500), nullable=True)
    images = Column(ARRAY(String), default=list)   

    # Ratings (denormalised for read performance; updated via background job later)
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)

    # Specifications stored as plain JSON text 
    specifications = Column(Text, nullable=True)    

    # Categorisation
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True, index=True)
    category = relationship("Category", back_populates="products")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, title={self.title!r})>"
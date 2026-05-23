"""
User model.

Stores registered users. Password is stored as a bcrypt hash — never plaintext.
The `is_guest` flag supports the assignment requirement: "assume a default user
is logged in" — the seed script can create a default guest user without a password.
"""

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=True)   # nullable for guest/seed user
    is_active = Column(Boolean, default=True, nullable=False)
    is_guest = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cart_items = relationship("CartItem", back_populates="user", lazy="dynamic")
    orders = relationship("Order", back_populates="user", lazy="dynamic")
    wishlist_items = relationship("WishlistItem", back_populates="user", lazy="dynamic")  # ← only addition

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"
"""
WishlistItem model.

Design decisions:
- Unique constraint on (user_id, product_id) enforced at DB level —
  prevents duplicates even under race conditions.
- product loaded via lazy="joined" — same pattern as CartItem,
  avoids N+1 on wishlist fetch.
- Soft cascade: deleting a user or product removes their wishlist rows.
"""

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.base import Base


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),
    )

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product", lazy="joined")

    def __repr__(self) -> str:
        return f"<WishlistItem(id={self.id}, user_id={self.user_id}, product_id={self.product_id})>"
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        default=1
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False, default=1)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    user = relationship(
        "User",
        back_populates="cart_items"
    )

    product = relationship(
        "Product",
        lazy="joined"
    )

    def __repr__(self) -> str:
        return f"<CartItem(id={self.id}, product_id={self.product_id}, qty={self.quantity})>"
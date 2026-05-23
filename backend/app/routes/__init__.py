from app.routes.products   import router as products_router
from app.routes.categories import router as categories_router
from app.routes.cart       import router as cart_router
from app.routes.auth       import router as auth_router
from app.routes.orders     import router as orders_router
from app.routes.wishlist   import router as wishlist_router          # ← only addition

__all__ = [
    "products_router",
    "categories_router",
    "cart_router",
    "auth_router",
    "orders_router",
    "wishlist_router",                                                # ← only addition
]
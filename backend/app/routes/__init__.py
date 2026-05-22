from app.routes.products import router as products_router
from app.routes.categories import router as categories_router
from app.routes.cart import router as cart_router
from app.routes.auth import router as auth_router

__all__ = ["products_router", "categories_router", "cart_router","auth_router"]
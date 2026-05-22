"""
FastAPI application entry point.

Responsibilities:
- App factory setup
- CORS configuration
- Router registration
- Health check endpoint
- DB table creation on startup (dev convenience; use Alembic in prod)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.session import engine

from app.routes import (
    products_router,
    categories_router,
    cart_router,
    auth_router,
)

# Import models so SQLAlchemy can discover them
# during Base.metadata.create_all()
import app.models  # noqa: F401


def create_app() -> FastAPI:
    application = FastAPI(
        title="Flipkart Clone API",
        version="1.0.0",
        description="Backend API for the Scaler SDE Intern Fullstack Assignment",
    )

    # -----------------------------
    # Create database tables
    # -----------------------------
    Base.metadata.create_all(bind=engine)

    # -----------------------------
    # CORS Configuration
    # -----------------------------
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # -----------------------------
    # API Routers
    # -----------------------------
    application.include_router(
        products_router,
        prefix="/api/v1",
        tags=["Products"],
    )

    application.include_router(
        categories_router,
        prefix="/api/v1",
        tags=["Categories"],
    )

    application.include_router(
        cart_router,
        prefix="/api/v1",
        tags=["Cart"],
    )

    application.include_router(
        auth_router,
        prefix="/api/v1",
        tags=["Authentication"],
    )

    # -----------------------------
    # Health Check
    # -----------------------------
    @application.get("/health", tags=["Health"])
    def health_check():
        return {
            "status": "ok",
            "version": "1.0.0",
            "message": "Flipkart Clone API Running",
        }

    return application


app = create_app()
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
from app.routes import products_router, categories_router, cart_router

# Import models so SQLAlchemy can discover them during Base.metadata.create_all
import app.models 


def create_app() -> FastAPI:
    application = FastAPI(
        title="Flipkart Clone API",
        version="1.0.0",
        description="Backend API for the Scaler SDE Intern Fullstack Assignment",
    )

    # CORS 
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],   # update for prod deployment
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers 
    application.include_router(products_router, prefix="/api/v1")
    application.include_router(categories_router, prefix="/api/v1")
    application.include_router(cart_router, prefix="/api/v1")

    # Events 
    def on_startup():
        Base.metadata.create_all(bind=engine)

    # Health check 
    @application.get("/health", tags=["Health"])
    def health_check():
        return {"status": "ok", "version": "1.0.0"}

    return application


app = create_app()
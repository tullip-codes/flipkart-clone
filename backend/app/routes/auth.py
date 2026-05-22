"""
Auth routes: /api/v1/auth/*

Endpoints:
  POST /auth/signup   - Register new user
  POST /auth/login    - Login, receive JWT
  GET  /auth/me       - Get current user profile (protected)
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.services.auth_service import get_profile, login, signup
from app.utils.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=Token, status_code=201)
def signup_route(payload: UserCreate, db: Session = Depends(get_db)):
    return signup(payload, db)


@router.post("/login", response_model=Token)
def login_route(payload: UserLogin, db: Session = Depends(get_db)):
    return login(payload, db)


@router.get("/me", response_model=UserResponse)
def me_route(current_user: User = Depends(get_current_user)):
    return get_profile(current_user)
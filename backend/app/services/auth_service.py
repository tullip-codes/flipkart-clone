"""
Auth business logic — separated from route handlers.

Pattern matches your existing product_service / cart_service.
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse
from app.utils.auth import create_access_token, hash_password, verify_password


def signup(payload: UserCreate, db: Session) -> Token:
    # Duplicate email check
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email)
    return Token(access_token=token, user=UserResponse.model_validate(user))


def login(payload: UserLogin, db: Session) -> Token:
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    token = create_access_token(user.id, user.email)
    return Token(access_token=token, user=UserResponse.model_validate(user))


def get_profile(user: User) -> UserResponse:
    return UserResponse.model_validate(user)
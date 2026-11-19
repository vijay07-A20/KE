from datetime import datetime, timedelta
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from app.config import settings
from app.database.sqlite_db import get_db
from app.models.sql_models import User, AuditLog
from app.schemas.schemas import UserLogin, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    # Verify password with bcrypt
    try:
        is_valid = bcrypt.checkpw(credentials.password.encode('utf-8'), user.hashed_password.encode('utf-8'))
    except Exception:
        is_valid = False

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    # Audit log
    db.add(AuditLog(
        user=user.username,
        action="LOGIN_SUCCESS",
        details=f"User {user.full_name} ({user.role}) logged in."
    ))
    db.commit()

    token_data = {"sub": user.username, "role": user.role, "id": user.id}
    access_token = create_access_token(token_data)

    user_resp = UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        fullName=user.full_name,
        role=user.role
    )
    return Token(access_token=access_token, token_type="bearer", user=user_resp)

@router.get("/demo-users", response_model=list[UserResponse])
def get_demo_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        UserResponse(
            id=u.id,
            username=u.username,
            email=u.email,
            fullName=u.full_name,
            role=u.role
        )
        for u in users
    ]

@router.post("/quick-switch/{role}", response_model=Token)
def quick_switch_role(role: str, db: Session = Depends(get_db)):
    """Convenience endpoint for UI to seamlessly switch between Doctor, Pharmacist, and Admin roles."""
    user = db.query(User).filter(User.role.ilike(role)).first()
    if not user:
        user = db.query(User).first()
        if not user:
            raise HTTPException(status_code=404, detail="No users configured")

    token_data = {"sub": user.username, "role": user.role, "id": user.id}
    access_token = create_access_token(token_data)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            fullName=user.full_name,
            role=user.role
        )
    )

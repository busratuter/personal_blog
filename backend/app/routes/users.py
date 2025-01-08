# routes/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.repositories.user_repository import create_user, get_user_by_username, update_user
from app.schemas.user import UserCreate, UserOut, UserLogin, Token, UserUpdate
from app.auth.auth import create_access_token, verify_password, hash_password
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_username(db, user_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    user = create_user(db, user_data)
    return user

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_username(db, user_data.username)
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    # Token oluştur
    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user=Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    updated_user = update_user(db, current_user.id, user_data)
    return updated_user

@router.put("/password", response_model=dict)
def update_password(
    password_data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        # Mevcut şifreyi doğrula
        if not verify_password(password_data["current_password"], current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Yeni şifreyi hashle ve güncelle
        current_user.hashed_password = hash_password(password_data["new_password"])
        db.commit()
        
        return {"message": "Password updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

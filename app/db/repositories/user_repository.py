# db/repositories/user_repository.py
from sqlalchemy.orm import Session
from db.models import User
from schemas.user import UserCreate
from auth.auth import hash_password

def create_user(db: Session, user_data: UserCreate):
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

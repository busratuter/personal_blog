from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from config import settings

def create_access_token(data: dict, expires_delta: int = 30):
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=expires_delta)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        print(f"Token created with secret: {settings.JWT_SECRET[:10]}...")
        return encoded_jwt
    except Exception as e:
        print(f"Token creation error: {str(e)}")
        raise

def verify_token(token: str):
    try:
        print(f"Verifying token with secret: {settings.JWT_SECRET[:10]}...")
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError as e:
        print(f"Token verification error: {str(e)}")
        raise

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
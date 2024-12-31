from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.category import CategoryCreate, CategoryOut
from app.db.repositories.category_repository import create_category, list_categories

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=CategoryOut)
def add_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    # İsteğe göre admin kontrolü ekleyin.
    return create_category(db, category_data)

@router.get("/", response_model=list[CategoryOut])
def get_all_categories(db: Session = Depends(get_db)):
    return list_categories(db)

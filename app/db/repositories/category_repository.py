from sqlalchemy.orm import Session
from app.db.models import Category
from app.schemas.category import CategoryCreate

def create_category(db: Session, category_data: CategoryCreate):
    category = Category(
        name=category_data.name,
        description=category_data.description
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def list_categories(db: Session):
    return db.query(Category).all()

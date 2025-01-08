from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db.repositories.saved_article_repository import SavedArticleRepository
from ..auth.dependencies import get_current_user
from typing import List
from ..db.models import Article, User

router = APIRouter(
    prefix="/saved-articles",
    tags=["saved-articles"]
)

@router.post("/{article_id}")
def save_article(article_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = SavedArticleRepository(db)
    try:
        return repo.save_article(current_user.id, article_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{article_id}")
def unsave_article(article_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = SavedArticleRepository(db)
    if repo.unsave_article(current_user.id, article_id):
        return {"message": "Article unsaved successfully"}
    raise HTTPException(status_code=404, detail="Saved article not found")

@router.get("/", response_model=List[dict])
def get_saved_articles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = SavedArticleRepository(db)
    return repo.get_saved_articles(current_user.id)

@router.get("/{article_id}/is-saved")
def check_if_saved(article_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = SavedArticleRepository(db)
    return {"is_saved": repo.is_article_saved(current_user.id, article_id)} 
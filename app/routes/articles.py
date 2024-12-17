from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from auth.dependencies import get_current_user
from schemas.article import ArticleCreate, ArticleUpdate, ArticleOut
from db.repositories.article_repository import create_article, get_articles, get_article, update_article, delete_article

router = APIRouter(prefix="/articles", tags=["Articles"])

@router.post("/", response_model=ArticleOut)
def create_new_article(article_data: ArticleCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    article = create_article(db, article_data, current_user.id)
    return article

@router.get("/", response_model=list[ArticleOut])
def list_articles(category_id: int = None, db: Session = Depends(get_db)):
    articles = get_articles(db, category_id)
    return articles

@router.get("/{article_id}", response_model=ArticleOut)
def read_article(article_id: int, db: Session = Depends(get_db)):
    article = get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.put("/{article_id}", response_model=ArticleOut)
def update_existing_article(article_id: int, article_data: ArticleUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    article = update_article(db, article_id, article_data, current_user.id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found or not allowed")
    return article

@router.delete("/{article_id}")
def remove_article(article_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    success = delete_article(db, article_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found or not allowed")
    return {"detail": "Article deleted"}

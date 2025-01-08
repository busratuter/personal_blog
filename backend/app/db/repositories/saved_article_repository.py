from sqlalchemy.orm import Session
from ..models import SavedArticle, Article, User
from typing import List

class SavedArticleRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_article(self, user_id: int, article_id: int) -> SavedArticle:
        saved_article = SavedArticle(user_id=user_id, article_id=article_id)
        self.db.add(saved_article)
        self.db.commit()
        self.db.refresh(saved_article)
        return saved_article

    def unsave_article(self, user_id: int, article_id: int) -> bool:
        saved_article = self.db.query(SavedArticle).filter(
            SavedArticle.user_id == user_id,
            SavedArticle.article_id == article_id
        ).first()
        if saved_article:
            self.db.delete(saved_article)
            self.db.commit()
            return True
        return False

    def get_saved_articles(self, user_id: int) -> List[dict]:
        saved = self.db.query(SavedArticle).filter(
            SavedArticle.user_id == user_id
        ).join(Article).join(User, Article.author_id == User.id).all()
        
        articles = []
        for item in saved:
            article = item.article
            articles.append({
                "id": article.id,
                "title": article.title,
                "content": article.content,
                "created_at": article.created_at,
                "updated_at": article.updated_at,
                "author": {
                    "id": article.author.id,
                    "username": article.author.username,
                    "email": article.author.email
                }
            })
        return articles

    def is_article_saved(self, user_id: int, article_id: int) -> bool:
        return self.db.query(SavedArticle).filter(
            SavedArticle.user_id == user_id,
            SavedArticle.article_id == article_id
        ).first() is not None 
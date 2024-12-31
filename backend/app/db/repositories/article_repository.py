from sqlalchemy.orm import Session
from app.db.models import Article
from app.schemas.article import ArticleCreate, ArticleUpdate

def create_article(db: Session, article_data: ArticleCreate, user_id: int):
    article = Article(
        title=article_data.title,
        content=article_data.content,
        category_id=article_data.category_id,
        author_id=user_id
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()

def get_articles(db: Session, category_id: int = None):
    query = db.query(Article)
    if category_id:
        query = query.filter(Article.category_id == category_id)
    return query.all()

def update_article(db: Session, article_id: int, article_data: ArticleUpdate, user_id: int):
    article = get_article(db, article_id)
    if article and article.author_id == user_id:
        if article_data.title is not None:
            article.title = article_data.title
        if article_data.content is not None:
            article.content = article_data.content
        if article_data.category_id is not None:
            article.category_id = article_data.category_id
        db.commit()
        db.refresh(article)
    return article

def delete_article(db: Session, article_id: int, user_id: int):
    article = get_article(db, article_id)
    if article and article.author_id == user_id:
        db.delete(article)
        db.commit()
        return True
    return False

from sqlalchemy.orm import Session
from app.db.models import Article, User
from app.schemas.article import ArticleCreate, ArticleUpdate
from app.services.azure_blob_service import AzureBlobStorage
import uuid

blob_storage = AzureBlobStorage()

def create_article(db: Session, article_data: ArticleCreate, user_id: int):
    # Get user information
    user = db.query(User).filter(User.id == user_id).first()
    
    # Benzersiz bir dosya adı oluştur (.txt uzantılı)
    filename = f"article_{user_id}_{uuid.uuid4()}.txt"
    
    article = Article(
        title=article_data.title,
        content=article_data.content,
        category_id=article_data.category_id,
        author_id=user_id,
        blob_filename=filename
    )
    
    db.add(article)
    db.commit()
    db.refresh(article)
    
    # Azure Blob Storage'a kaydet
    article_json = {
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "category_id": article.category_id,
        "author_id": article.author_id,
        "created_at": str(article.created_at),
        "updated_at": str(article.updated_at) if article.updated_at else None
    }
    
    blob_url = blob_storage.upload_article(
        article_json, 
        filename,
        user_id=user.id,
        first_name=user.first_name or "",
        last_name=user.last_name or "",
        as_plain_text=True  # Düz metin formatında kaydet
    )
    return article

def get_articles_by_user(db: Session, user_id: int):
    return db.query(Article).filter(Article.author_id == user_id).all()

def get_articles_except_user(db: Session, user_id: int):
    return db.query(Article).filter(Article.author_id != user_id).all()

def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()

def update_article(db: Session, article_id: int, article_data: ArticleUpdate, user_id: int):
    article = get_article(db, article_id)
    if article and article.author_id == user_id:
        # Get user information
        user = db.query(User).filter(User.id == user_id).first()
        
        if article_data.title is not None:
            article.title = article_data.title
        if article_data.content is not None:
            article.content = article_data.content
        if article_data.category_id is not None:
            article.category_id = article_data.category_id
            
        db.commit()
        db.refresh(article)
        
        # Azure Blob Storage'ı güncelle
        article_json = {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "category_id": article.category_id,
            "author_id": article.author_id,
            "created_at": str(article.created_at),
            "updated_at": str(article.updated_at)
        }
        blob_storage.upload_article(
            article_json, 
            article.blob_filename,
            user_id=user.id,
            first_name=user.first_name or "",
            last_name=user.last_name or "",
            as_plain_text=True  # Düz metin formatında kaydet
        )
    return article

def delete_article(db: Session, article_id: int, user_id: int):
    article = get_article(db, article_id)
    if article and article.author_id == user_id:
        try:
            # Get user information
            user = db.query(User).filter(User.id == user_id).first()
            
            # Azure Blob Storage'dan sil
            blob_storage.delete_article(
                article.blob_filename,  # Kaydedilen blob dosya adını kullan
                user_id=user.id,
                first_name=user.first_name or "",
                last_name=user.last_name or ""
            )
            
            # Veritabanından sil
            db.delete(article)
            db.commit()
            return True
        except Exception as e:
            print(f"Error deleting article: {str(e)}")
            db.rollback()
            return False
    return False

def create_article_from_file(
    db: Session,
    title: str,
    category_id: int,
    file_content: bytes,
    file_name: str,
    user_id: int
):
    # Get user information
    user = db.query(User).filter(User.id == user_id).first()
    
    # Benzersiz bir dosya adı oluştur (.txt uzantılı)
    filename = f"article_{user_id}_{uuid.uuid4()}.txt"
    
    # Dosya içeriğini text olarak al
    if file_name.endswith('.pdf'):
        # PDF dosyasını text'e çevir
        import io
        import PyPDF2
        
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        content = ""
        for page in pdf_reader.pages:
            content += page.extract_text()
    else:
        # TXT dosyası ise direkt oku
        content = file_content.decode('utf-8')
    
    article = Article(
        title=title,
        content=content,
        category_id=category_id,
        author_id=user_id,
        blob_filename=filename
    )
    
    db.add(article)
    db.commit()
    db.refresh(article)
    
    # Azure Blob Storage'a kaydet
    article_json = {
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "category_id": article.category_id,
        "author_id": article.author_id,
        "created_at": str(article.created_at),
        "updated_at": str(article.updated_at) if article.updated_at else None,
        "original_filename": file_name
    }
    
    blob_url = blob_storage.upload_article(
        article_json, 
        filename,
        user_id=user.id,
        first_name=user.first_name or "",
        last_name=user.last_name or "",
        as_plain_text=True
    )
    
    return article

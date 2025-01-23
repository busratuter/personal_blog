from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.auth.dependencies import get_current_user
from app.schemas.article import ArticleCreate, ArticleUpdate, ArticleOut
from app.db.repositories.article_repository import (
    create_article, 
    get_articles_by_user, 
    get_articles_except_user,
    get_article, 
    update_article, 
    delete_article,
    create_article_from_file
)
from typing import List, Optional
from ..services.gpt_service import gpt_service
from pydantic import BaseModel
import json
from ..services.pdf_service import PDFService
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/articles", tags=["Articles"])

class ChatMessage(BaseModel):
    message: str

@router.post("/", response_model=ArticleOut)
def create_new_article(
    article_data: ArticleCreate, 
    db: Session = Depends(get_db), 
    current_user=Depends(get_current_user)
):
    article = create_article(db, article_data, current_user.id)
    return article

@router.get("/my-articles", response_model=list[ArticleOut])
def get_user_articles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    articles = get_articles_by_user(db, current_user.id)
    return articles

@router.get("/feed", response_model=list[ArticleOut])
def get_articles_feed(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    articles = get_articles_except_user(db, current_user.id)
    return articles

@router.get("/{article_id}", response_model=ArticleOut)
def read_article(
    article_id: int, 
    db: Session = Depends(get_db)
):
    article = get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.put("/{article_id}", response_model=ArticleOut)
def update_existing_article(
    article_id: int, 
    article_data: ArticleUpdate, 
    db: Session = Depends(get_db), 
    current_user=Depends(get_current_user)
):
    article = update_article(db, article_id, article_data, current_user.id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found or not allowed")
    return article

@router.delete("/{article_id}")
def remove_article(
    article_id: int, 
    db: Session = Depends(get_db), 
    current_user=Depends(get_current_user)
):
    success = delete_article(db, article_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found or not allowed")
    return {"detail": "Article deleted"}

@router.post("/upload")
async def upload_article(
    title: str = Form(...),
    category_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Dosya tipini kontrol et
    if not file.content_type in ["application/pdf", "text/plain"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are allowed"
        )
    
    try:
        # Dosya içeriğini oku
        content = await file.read()
        
        # Yeni makale oluştur
        article = create_article_from_file(
            db=db,
            title=title,
            category_id=category_id,
            file_content=content,
            file_name=file.filename,
            user_id=current_user.id
        )
        
        return article
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/{article_id}/chat", response_model=str)
async def chat_with_article(
    article_id: int,
    chat_message: ChatMessage,
    db: Session = Depends(get_db)
):
    article = get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Makale bulunamadı")
    
    # Kategori adını al
    category_name = article.category.name if article.category else "Kategori belirtilmemiş"
    
    response = gpt_service.chat_with_article(article.content, article.title, category_name, chat_message.message)
    return response

@router.post("/generate", response_model=dict)
async def generate_article(prompt: dict):
    try:
        response = gpt_service.generate_article(prompt["text"])
        # GPT'den gelen string yanıtı JSON'a çevir
        article_data = json.loads(response)
        return article_data
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="GPT yanıtı beklenilen formatta değil"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/{article_id}/pdf")
async def download_article_pdf(article_id: int, db: Session = Depends(get_db)):
    article = get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    pdf_service = PDFService()
    pdf_buffer = pdf_service.create_article_pdf(article.__dict__)
    
    headers = {
        'Content-Disposition': f'attachment; filename="article_{article_id}.pdf"'
    }
    
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)

# main.py
import uvicorn
from fastapi import FastAPI
from app.db.database import Base, engine
from app.routes.users import router as users_router
from app.routes.articles import router as articles_router
from app.routes.categories import router as categories_router
from app.routes.saved_articles import router as saved_articles_router
from fastapi.middleware.cors import CORSMiddleware

# Veritabanı tablolarını oluşturun (eğer yoksa)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="My Blog API",
    description="A backend API for a personal blog platform similar to Medium.",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend'in çalıştığı adres
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]  # PDF indirme için gerekli
)

# Rotaları ekle
app.include_router(users_router)
app.include_router(articles_router)
app.include_router(categories_router)
app.include_router(saved_articles_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

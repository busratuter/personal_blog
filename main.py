# main.py
import uvicorn
from fastapi import FastAPI
from app.db.database import Base, engine
from app.routes.users import router as users_router
from app.routes.articles import router as articles_router
from app.routes.categories import router as categories_router

# Veritabanı tablolarını oluşturun (eğer yoksa)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="My Blog API",
    description="A backend API for a personal blog platform similar to Medium.",
    version="1.0.0"
)

# Ana route (sağlık kontrolü vb.)
@app.get("/")
def read_root():
    return {"message": "Welcome to the Blog API"}

# Router'ları ekleyelim
app.include_router(users_router)
app.include_router(articles_router)
app.include_router(categories_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

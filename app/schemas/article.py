from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ArticleBase(BaseModel):
    title: str
    content: str
    category_id: int

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    category_id: Optional[int]

class ArticleOut(BaseModel):
    id: int
    title: str
    content: str
    category_id: int
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

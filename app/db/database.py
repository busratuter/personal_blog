from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import DATABASE_URL

Base = declarative_base()

# echo=True debug amaçlı kullanılır. Prod'da False yapın.
engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency olarak kullanacağımız fonksiyon.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

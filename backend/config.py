# config.py
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

# Ortam değişkenlerinden değerleri çekiyoruz.
DB_SERVER = os.getenv("DB_SERVER", "blog-project.database.windows.net")
DB_NAME = os.getenv("DB_NAME", "project-blog")
DB_USER = os.getenv("DB_USER", "dbadmin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Busra123*")
DB_DRIVER = os.getenv("DB_DRIVER", "ODBC+Driver+17+for+SQL+Server")

# Azure SQL bağlantı URL'sini SQLAlchemy formatında oluşturuyoruz.
# pyodbc kullanarak bağlanacaksanız:
# mssql+pyodbc://<username>:<password>@<host>:<port>/<database>?driver=<driver>
# Not: <driver> alanında boşlukları URL encode yapmak gerekebilir: 'ODBC+Driver+17+for+SQL+Server'
ENCODED_DRIVER = DB_DRIVER.replace(" ", "+")

class Settings(BaseSettings):
    # Database settings
    DB_SERVER: str = DB_SERVER
    DB_NAME: str = DB_NAME
    DB_USER: str = DB_USER
    DB_PASSWORD: str = DB_PASSWORD
    DB_DRIVER: str = DB_DRIVER
    ENCODED_DRIVER: str = ENCODED_DRIVER
    DATABASE_URL: str = "sqlite:///./blog.db"
    # Alternatif SQL Server bağlantısı için:
    # DATABASE_URL: str = f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD}@{DB_SERVER}:1433/{DB_NAME}?driver={ENCODED_DRIVER}"
    
    # JWT settings
    JWT_SECRET: str = "c25e1f1749e52e0573d452f6c96d8469291b291a09f7e892efc5d78e46125d3b"
    JWT_ALGORITHM: str = "HS256"
    
    # Azure Blob Storage settings
    AZURE_STORAGE_CONNECTION_STRING: str = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "DefaultEndpointsProtocol=https;AccountName=websiteblog;AccountKey=Ua795JcWWv5lQuz9LDN3eS1lyXeuO7excw2jZRm98C1+xQ5KnSu0w0JRePF74aL40EwD/KGbRvam+ASt8KrVFg==;EndpointSuffix=core.windows.net")
    AZURE_STORAGE_CONTAINER_NAME: str = "blog-articles"
    
    # GPT settings
    GPT_ENDPOINT: str = "https://busra-works.openai.azure.com/openai/deployments/4o-deneme/chat/completions?api-version=2024-08-01-preview"
    GPT_API_KEY: str = "4fb500d5fe9742d8bd6b12d3fc42562a"
    GPT_MODEL: str = "4o-deneme"

settings = Settings()

# config.example.py
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

# Fetch values from environment variables
DB_SERVER = os.getenv("DB_SERVER", "your-database-server")
DB_NAME = os.getenv("DB_NAME", "your-database-name")
DB_USER = os.getenv("DB_USER", "your-database-user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "your-database-password")
DB_DRIVER = os.getenv("DB_DRIVER", "ODBC+Driver+17+for+SQL+Server")

# Create the Azure SQL connection URL in SQLAlchemy format
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
    # Alternative SQL Server connection:
    # DATABASE_URL: str = f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD}@{DB_SERVER}:1433/{DB_NAME}?driver={ENCODED_DRIVER}"
    
    # JWT settings
    JWT_SECRET: str = "your-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    
    # Azure Blob Storage settings
    AZURE_STORAGE_CONNECTION_STRING: str = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "your-azure-storage-connection-string")
    AZURE_STORAGE_CONTAINER_NAME: str = "your-container-name"
    
    # GPT settings
    GPT_ENDPOINT: str = "https://your-gpt-endpoint"
    GPT_API_KEY: str = "your-gpt-api-key"
    GPT_MODEL: str = "your-gpt-model"

settings = Settings() 
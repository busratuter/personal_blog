# config.py
import os
from dotenv import load_dotenv

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
DATABASE_URL = "sqlite:///./blog.db"

#DATABASE_URL = "mssql+pyodbc://dbadmin:Busra123*@blog-project.database.windows.net:1433/project-blog?driver=ODBC+Driver+17+for+SQL+Server"


# Diğer konfigürasyon değerleri (örneğin JWT secret, Azure Blob vs.)
JWT_SECRET = "c25e1f1749e52e0573d452f6c96d8469291b291a09f7e892efc5d78e46125d3b"
JWT_ALGORITHM = "HS256"

# Azure Blob Storage ayarları
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "DefaultEndpointsProtocol=https;AccountName=websiteblog;AccountKey=Ua795JcWWv5lQuz9LDN3eS1lyXeuO7excw2jZRm98C1+xQ5KnSu0w0JRePF74aL40EwD/KGbRvam+ASt8KrVFg==;EndpointSuffix=core.windows.net")
AZURE_STORAGE_CONTAINER_NAME = "blog-articles"

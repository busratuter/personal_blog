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
JWT_SECRET = os.getenv("JWT_SECRET", "8d5f8db058e83e6415f2273b3c67bb5b8ea2014cfd89775671e64d648561cd93")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

AZURE_BLOB_CONNECTION_STRING = os.getenv("AZURE_BLOB_CONNECTION_STRING")
AZURE_BLOB_CONTAINER = os.getenv("AZURE_BLOB_CONTAINER", "your_container_name")

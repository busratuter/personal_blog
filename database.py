from sqlalchemy import create_engine

DATABASE_URL = "mssql+pyodbc://<username>:<password>@<server>.database.windows.net/<dbname>?driver=ODBC+Driver+17+for+SQL+Server"

engine = create_engine(DATABASE_URL)
connection = engine.connect()
print("Connection successful!")
connection.close()

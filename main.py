from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
      return {"message": "Personal Blog API'ye Hos Geldiniz"}

from fastapi import FastAPI

app = FastAPI(title="MarketAI API")

@app.get("/")
async def root():
    return {"message": "MarketAI AI Service"}
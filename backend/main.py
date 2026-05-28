from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

API_KEY = os.getenv("DEEPSEEK_API_KEY")

class GenRequest(BaseModel):
    system: str
    user: str

@app.post("/api/generate")
async def generate(req: GenRequest):
    if not API_KEY:
        raise HTTPException(500, "API key not configured")
    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            "https://api.deepseek.com/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": req.system},
                    {"role": "user",   "content": req.user}
                ],
                "max_tokens": 2000,
                "temperature": 0.7
            }
        )
        data = res.json()
        content = data["choices"][0]["message"]["content"]
        return {"content": content}

@app.get("/health")
def health():
    return {"status": "ok"}

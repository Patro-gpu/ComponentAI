from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx, os, logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY") or os.getenv("DEEPSEEK_API_KEY")
API_BASE = os.getenv("API_BASE", "https://api.deepseek.com")
MODEL = os.getenv("MODEL", "deepseek-chat")


class GenRequest(BaseModel):
    system: str
    user: str


@app.post("/api/generate")
async def generate(req: GenRequest):
    if not API_KEY:
        raise HTTPException(500, "API_KEY not configured")

    url = f"{API_BASE}/chat/completions"
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            url,
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": req.system},
                    {"role": "user", "content": req.user},
                ],
                "max_tokens": 2000,
                "temperature": 0.7,
            },
        )
        data = res.json()
        logger.info(f"API status={res.status_code} model={MODEL} keys={list(data.keys())}")

        if "choices" in data:
            return {"content": data["choices"][0]["message"]["content"]}
        else:
            raise HTTPException(500, f"API error: {data}")


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL}

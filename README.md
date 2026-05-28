# ComponentAI

AI-powered UI component generator. Describe your component in natural language, get production-grade code for React, Vue, Svelte, or Web Components.

## Project Structure

```
componentai/
├── frontend/
│   └── index.html        # Frontend UI
├── backend/
│   ├── main.py           # FastAPI server
│   ├── requirements.txt  # Python dependencies
│   ├── Procfile          # Railway/Render deployment
│   └── .env.example      # Environment variable template
└── README.md
```

## Quick Start (Local)

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # edit .env with your DEEPSEEK_API_KEY
uvicorn main:app --reload   # runs on http://localhost:8000
```

### Frontend

Open `frontend/index.html` directly in your browser, or serve with any static server:

```bash
npx serve frontend
```

## Deploy

| Layer | Platform | Steps |
|-------|----------|-------|
| Backend | [Railway](https://railway.app) | Deploy `backend/` folder, set `DEEPSEEK_API_KEY` env var |
| Frontend | [Vercel](https://vercel.com) | Deploy `frontend/` folder, update `API_BASE` in `index.html` to your Railway URL |

## API

`POST /api/generate`

```json
{
  "system": "You are a senior frontend engineer...",
  "user": "Create a gradient purple button with loading state"
}
```

Returns:

```json
{
  "content": "// generated component code here"
}
```

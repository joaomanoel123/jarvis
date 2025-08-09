from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(title="Jarvis API", version="0.1.0")

# CORS (ajuste os domínios conforme necessário)
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Command(BaseModel):
    message: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/command")
async def command(cmd: Command):
    message = cmd.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Empty message")

    # Aqui você pode integrar com IA (Gemini, OpenAI, etc.)
    # Por enquanto, apenas ecoa uma resposta simples
    response = f"Você disse: {message}. Em breve, conectaremos com a IA."
    return {"reply": response}

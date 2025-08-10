from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import json
from typing import Optional

app = FastAPI(title="Jarvis API", version="1.0.0")

# CORS - Configurado para GitHub Pages
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurações
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

class Command(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str
    environment: str
    api_configured: bool

@app.get("/health", response_model=HealthResponse)
async def health():
    return {
        "status": "ok",
        "environment": ENVIRONMENT,
        "api_configured": bool(GOOGLE_API_KEY)
    }

@app.post("/command")
async def command(cmd: Command):
    message = cmd.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Empty message")

    # Verificar se a API key está configurada
    if not GOOGLE_API_KEY:
        return {
            "reply": "⚠️ API do Google não configurada. Configure GOOGLE_API_KEY no Render Dashboard.",
            "error": "missing_api_key"
        }

    try:
        # Integração com Google Gemini
        response = await call_gemini_api(message)
        return {"reply": response}
    except Exception as e:
        print(f"Erro na API: {e}")
        return {
            "reply": f"🤖 Desculpe, houve um erro ao processar sua mensagem. Tente novamente.",
            "error": "api_error"
        }

async def call_gemini_api(message: str) -> str:
    """Chama a API do Google Gemini"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GOOGLE_API_KEY}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": f"Você é JARVIS, um assistente virtual inteligente criado por Tony Stark. Responda de forma útil e com personalidade do JARVIS. Pergunta: {message}"
            }]
        }]
    }
    
    response = requests.post(url, headers=headers, json=data, timeout=30)
    
    if response.status_code == 200:
        result = response.json()
        if "candidates" in result and len(result["candidates"]) > 0:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            return "🤖 Não consegui gerar uma resposta adequada. Tente reformular sua pergunta."
    else:
        print(f"Erro na API Gemini: {response.status_code} - {response.text}")
        raise Exception(f"API Error: {response.status_code}")

@app.get("/")
async def root():
    return {
        "message": "🤖 Jarvis API está funcionando!",
        "version": "1.0.0",
        "frontend": "https://joaomanoel123.github.io/jarvis",
        "docs": "/docs"
    }

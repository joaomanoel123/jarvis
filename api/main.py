from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import os
import requests
import json
import traceback
import base64
from typing import Optional

app = FastAPI(title="Jarvis API", version="1.0.0")

# CORS - Configurado para GitHub Pages
default_origins = [
    "https://joaomanoel123.github.io",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000"
]

# Permitir origens customizadas via env var, mas sempre incluir as padrões
custom_origins = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else []
origins = list(set(default_origins + [origin.strip() for origin in custom_origins if origin.strip()]))

print(f"🔒 CORS Origins configuradas: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Configurações
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Manter para compatibilidade
MURF_API_KEY = os.getenv("MURF_API_KEY")  # Chave API do Murf AI
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Priorizar Groq, fallback para Google
API_KEY = GROQ_API_KEY or GOOGLE_API_KEY
API_PROVIDER = "groq" if GROQ_API_KEY else "google" if GOOGLE_API_KEY else None

class Command(BaseModel):
    message: str

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "pt-BR-female-1"
    speed: Optional[float] = 1.0
    pitch: Optional[float] = 1.0
    volume: Optional[float] = 0.8
    format: Optional[str] = "mp3"

class HealthResponse(BaseModel):
    status: str
    environment: str
    api_configured: bool
    api_provider: str
    murf_tts_configured: bool

@app.get("/health", response_model=HealthResponse)
async def health():
    return {
        "status": "ok",
        "environment": ENVIRONMENT,
        "api_configured": bool(API_KEY),
        "api_provider": API_PROVIDER or "none",
        "murf_tts_configured": bool(MURF_API_KEY)
    }

@app.post("/command")
async def command(cmd: Command):
    message = cmd.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Empty message")

    print(f"📥 Recebida mensagem: {message}")
    print(f"🔌 Provedor de API: {API_PROVIDER}")
    
    # Verificar se alguma API key está configurada
    if not API_KEY:
        print("❌ Nenhuma API Key configurada")
        return {
            "reply": "⚠️ Nenhuma API configurada. Configure GROQ_API_KEY ou GOOGLE_API_KEY no Render Dashboard.",
            "error": "missing_api_key"
        }
    
    print(f"✅ {API_PROVIDER.upper()} API Key configurada: {API_KEY[:10]}...")

    try:
        # Chamar a API apropriada
        if API_PROVIDER == "groq":
            print("🔄 Chamando Groq API...")
            response = await call_groq_api(message)
        else:
            print("🔄 Chamando Google Gemini API...")
            response = await call_gemini_api(message)
            
        print(f"✅ Resposta recebida: {response[:100]}...")
        return {"reply": response}
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro de rede na API {API_PROVIDER}: {e}")
        return {
            "reply": f"🌐 Erro de conexão com a API {API_PROVIDER.upper()}. Verifique sua conexão com a internet.",
            "error": "network_error",
            "details": str(e)
        }
    except ValueError as e:
        print(f"❌ Erro de formato na resposta da API: {e}")
        return {
            "reply": f"📝 Erro ao processar resposta da API {API_PROVIDER.upper()}. Formato inválido.",
            "error": "format_error",
            "details": str(e)
        }
    except Exception as e:
        print(f"❌ Erro inesperado: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return {
            "reply": f"🤖 Erro interno: {type(e).__name__}. Verifique os logs do servidor.",
            "error": "internal_error",
            "error_type": type(e).__name__,
            "details": str(e)
        }

async def call_groq_api(message: str) -> str:
    """Chama a API do Groq"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    print(f"🔗 URL da API Groq: {url}")
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "llama3-8b-8192",  # Modelo rápido e eficiente
        "messages": [
            {
                "role": "system",
                "content": "Você é JARVIS, um assistente virtual inteligente criado por Tony Stark, agora configurado especialmente para João Manoel. Sempre responda em português brasileiro. Seja educado, eficiente, ligeiramente formal mas amigável. Quando apropriado, chame o usuário de 'João Manoel' ou 'Sr. João Manoel'. Suas respostas devem ser úteis e concisas."
            },
            {
                "role": "user",
                "content": message
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.7,
        "stream": False
    }
    
    print(f"📤 Enviando dados para Groq: {json.dumps(data, indent=2)[:300]}...")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"📡 Status da resposta Groq: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📝 Resposta JSON Groq: {json.dumps(result, indent=2)[:300]}...")
            
            if "choices" in result and len(result["choices"]) > 0:
                choice = result["choices"][0]
                if "message" in choice and "content" in choice["message"]:
                    text = choice["message"]["content"].strip()
                    print(f"✅ Texto extraído do Groq: {text[:100]}...")
                    return text
                else:
                    print("❌ Estrutura de resposta Groq inválida - sem message/content")
                    return "🤖 Resposta da API Groq em formato inesperado. Tente novamente."
            else:
                print("❌ Nenhuma escolha na resposta do Groq")
                return "🤖 Não consegui gerar uma resposta adequada. Tente reformular sua pergunta."
        elif response.status_code == 401:
            error_text = response.text
            print(f"❌ Erro 401 da API Groq: {error_text}")
            raise Exception("Chave da API do Groq inválida ou expirada")
        elif response.status_code == 429:
            error_text = response.text
            print(f"❌ Erro 429 da API Groq: {error_text}")
            raise Exception("Limite de taxa da API Groq excedido. Tente novamente em alguns segundos.")
        elif response.status_code == 400:
            error_text = response.text
            print(f"❌ Erro 400 da API Groq: {error_text}")
            raise Exception(f"Erro na requisição para Groq: {error_text}")
        else:
            error_text = response.text
            print(f"❌ Erro {response.status_code} da API Groq: {error_text}")
            raise Exception(f"Erro HTTP {response.status_code}: {error_text}")
            
    except requests.exceptions.Timeout:
        print("❌ Timeout na API do Groq")
        raise Exception("Timeout na API do Groq. Tente novamente.")
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão com a API do Groq")
        raise Exception("Erro de conexão com a API do Groq. Verifique a internet.")
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro de requisição Groq: {e}")
        raise Exception(f"Erro na requisição para Groq: {e}")

async def call_gemini_api(message: str) -> str:
    """Chama a API do Google Gemini"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GOOGLE_API_KEY}"
    
    print(f"🔗 URL da API: {url[:80]}...")
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{
                "text": f"Você é JARVIS, um assistente virtual inteligente criado por Tony Stark, configurado especialmente para João Manoel. Sempre responda em português brasileiro. Seja educado, eficiente e amigável. Quando apropriado, chame o usuário de 'João Manoel' ou 'Sr. João Manoel'. Pergunta: {message}"
            }]
        }]
    }
    
    print(f"📤 Enviando dados: {json.dumps(data, indent=2)[:200]}...")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"📡 Status da resposta: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"📝 Resposta JSON: {json.dumps(result, indent=2)[:300]}...")
            
            if "candidates" in result and len(result["candidates"]) > 0:
                candidate = result["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    text = candidate["content"]["parts"][0]["text"]
                    print(f"✅ Texto extraído: {text[:100]}...")
                    return text
                else:
                    print("❌ Estrutura de resposta inválida - sem content/parts")
                    return "🤖 Resposta da API em formato inesperado. Tente novamente."
            else:
                print("❌ Nenhum candidato na resposta")
                return "🤖 Não consegui gerar uma resposta adequada. Tente reformular sua pergunta."
        elif response.status_code == 400:
            error_text = response.text
            print(f"❌ Erro 400 da API Gemini: {error_text}")
            if "API_KEY_INVALID" in error_text:
                raise Exception("Chave da API do Google inválida")
            elif "QUOTA_EXCEEDED" in error_text:
                raise Exception("Cota da API do Google excedida")
            else:
                raise Exception(f"Erro na requisição: {error_text}")
        elif response.status_code == 403:
            print(f"❌ Erro 403 da API Gemini: {response.text}")
            raise Exception("Acesso negado à API do Google. Verifique as permissões da chave.")
        else:
            error_text = response.text
            print(f"❌ Erro {response.status_code} da API Gemini: {error_text}")
            raise Exception(f"Erro HTTP {response.status_code}: {error_text}")
            
    except requests.exceptions.Timeout:
        print("❌ Timeout na API do Google")
        raise Exception("Timeout na API do Google. Tente novamente.")
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão com a API do Google")
        raise Exception("Erro de conexão com a API do Google. Verifique a internet.")
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro de requisição: {e}")
        raise Exception(f"Erro na requisição: {e}")

@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    """Endpoint para Text-to-Speech usando Murf AI"""
    
    if not MURF_API_KEY:
        raise HTTPException(
            status_code=503, 
            detail="Murf AI TTS não configurado. Configure MURF_API_KEY no Render Dashboard."
        )
    
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Texto não pode estar vazio")
    
    print(f"🎵 TTS Request - Texto: {request.text[:50]}...")
    print(f"🎤 Voz: {request.voice_id}, Velocidade: {request.speed}, Tom: {request.pitch}")
    
    try:
        # Chamar API do Murf AI
        audio_data = await call_murf_tts_api(
            text=request.text,
            voice_id=request.voice_id,
            speed=request.speed,
            pitch=request.pitch,
            volume=request.volume,
            format=request.format
        )
        
        # Retornar áudio como resposta
        return Response(
            content=audio_data,
            media_type=f"audio/{request.format}",
            headers={
                "Content-Disposition": f"attachment; filename=tts_audio.{request.format}",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
        
    except Exception as e:
        print(f"❌ Erro no TTS: {e}")
        raise HTTPException(status_code=500, detail=f"Erro no TTS: {str(e)}")

async def call_murf_tts_api(text: str, voice_id: str, speed: float, pitch: float, volume: float, format: str) -> bytes:
    """Chama a API do Murf AI para gerar áudio"""
    
    url = "https://api.murf.ai/v1/speech"
    
    headers = {
        "Authorization": f"Bearer {MURF_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Limpar texto de emojis e caracteres especiais
    clean_text = clean_text_for_tts(text)
    
    data = {
        "text": clean_text,
        "voice_id": voice_id,
        "speed": speed,
        "pitch": pitch,
        "volume": volume,
        "format": format
    }
    
    print(f"🔗 Chamando Murf API: {url}")
    print(f"📤 Dados: {json.dumps(data, indent=2)[:300]}...")
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        print(f"📡 Status Murf API: {response.status_code}")
        
        if response.status_code == 200:
            # Verificar se a resposta é áudio direto ou JSON
            content_type = response.headers.get('content-type', '')
            
            if 'audio' in content_type:
                # Resposta direta de áudio
                print(f"✅ Áudio recebido diretamente ({len(response.content)} bytes)")
                return response.content
            else:
                # Resposta JSON com URL ou base64
                try:
                    result = response.json()
                    print(f"📝 Resposta JSON Murf: {json.dumps(result, indent=2)[:200]}...")
                    
                    if 'audio_url' in result:
                        # Download do áudio via URL
                        audio_response = requests.get(result['audio_url'], timeout=30)
                        if audio_response.status_code == 200:
                            print(f"✅ Áudio baixado via URL ({len(audio_response.content)} bytes)")
                            return audio_response.content
                        else:
                            raise Exception(f"Erro ao baixar áudio: {audio_response.status_code}")
                    
                    elif 'audio_data' in result:
                        # Decodificar base64
                        audio_bytes = base64.b64decode(result['audio_data'])
                        print(f"✅ Áudio decodificado de base64 ({len(audio_bytes)} bytes)")
                        return audio_bytes
                    
                    else:
                        raise Exception("Formato de resposta não reconhecido")
                        
                except json.JSONDecodeError:
                    # Se não for JSON, assumir que é áudio direto
                    print(f"✅ Áudio recebido como dados brutos ({len(response.content)} bytes)")
                    return response.content
        
        elif response.status_code == 401:
            raise Exception("Chave da API do Murf AI inválida ou expirada")
        elif response.status_code == 429:
            raise Exception("Limite de taxa da API Murf AI excedido")
        elif response.status_code == 400:
            error_text = response.text
            raise Exception(f"Erro na requisição Murf AI: {error_text}")
        else:
            error_text = response.text
            raise Exception(f"Erro HTTP {response.status_code}: {error_text}")
            
    except requests.exceptions.Timeout:
        raise Exception("Timeout na API do Murf AI")
    except requests.exceptions.ConnectionError:
        raise Exception("Erro de conexão com a API do Murf AI")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Erro na requisição para Murf AI: {e}")

def clean_text_for_tts(text: str) -> str:
    """Limpa o texto para TTS removendo emojis e caracteres especiais"""
    if not text:
        return ""
    
    # Remover emojis
    import re
    
    # Padrões de emoji
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002600-\U000026FF"  # miscellaneous symbols
        "\U00002700-\U000027BF"  # dingbats
        "]+", flags=re.UNICODE
    )
    
    # Remover emojis específicos comuns
    text = re.sub(r'[🤖🗣️📱✅❌⚠️🔄🔍🎯📡📝🌊🔙💬🚫⏱️🔌🎆💾⚙️🎤🌐🔑🎵]', '', text)
    
    # Aplicar padrão geral de emoji
    text = emoji_pattern.sub('', text)
    
    # Limpar espaços extras
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n+', ' ', text)
    
    return text.strip()

@app.get("/")
async def root():
    return {
        "message": "🤖 Jarvis API está funcionando!",
        "version": "1.2.0",
        "frontend": "https://joaomanoel123.github.io/jarvis",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "chat": "/command",
            "tts": "/tts",
            "health": "/health"
        },
        "api_provider": API_PROVIDER or "none",
        "groq_api_configured": bool(GROQ_API_KEY),
        "google_api_configured": bool(GOOGLE_API_KEY),
        "murf_tts_configured": bool(MURF_API_KEY)
    }

@app.get("/debug")
async def debug():
    """Endpoint para debug - só funciona em desenvolvimento"""
    if ENVIRONMENT != "development":
        raise HTTPException(status_code=404, detail="Not found")
    
    return {
        "environment": ENVIRONMENT,
        "api_provider": API_PROVIDER,
        "groq_api_key_configured": bool(GROQ_API_KEY),
        "groq_api_key_length": len(GROQ_API_KEY) if GROQ_API_KEY else 0,
        "google_api_key_configured": bool(GOOGLE_API_KEY),
        "google_api_key_length": len(GOOGLE_API_KEY) if GOOGLE_API_KEY else 0,
        "murf_api_key_configured": bool(MURF_API_KEY),
        "murf_api_key_length": len(MURF_API_KEY) if MURF_API_KEY else 0,
        "cors_origins": origins,
        "version": "1.2.0"
    }

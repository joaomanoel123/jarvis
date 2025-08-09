Jarvis API – Deta Space

Como rodar localmente
- python -m venv .venv && source .venv/bin/activate
- pip install -r requirements.txt
- uvicorn main:app --reload --host 0.0.0.0 --port 8000

Endpoints
- GET /health -> { status: "ok" }
- POST /command -> body { message: "texto" } -> { reply: "..." }

Deploy gratuito (Render.com)
1) Crie uma conta em https://render.com e conecte ao GitHub.
2) Clique em New + e escolha Web Service.
3) Escolha o repositório: jarvis e a pasta api (Root Directory = api) — se usar render.yaml, basta usar o botão "New + Blueprint".
4) Runtime: Python
5) Build Command: pip install -r requirements.txt
6) Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
7) Plano: Free
8) Env Vars: CORS_ORIGINS = https://joaomanoel123.github.io,https://joaomanoel123.github.io/jarvis

Blueprint (opcional)
- Já incluí render.yaml na raiz do repo. Você pode criar por Blueprint:
  - Dashboard Render > New + > Blueprint > conecte o repo > Deploy.

CORS
- Configure a env CORS_ORIGINS com os domínios do seu front (ex: https://joaomanoel123.github.io)

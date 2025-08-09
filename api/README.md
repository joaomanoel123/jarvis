Jarvis API – Deta Space

Como rodar localmente
- python -m venv .venv && source .venv/bin/activate
- pip install -r requirements.txt
- uvicorn main:app --reload --host 0.0.0.0 --port 8000

Endpoints
- GET /health -> { status: "ok" }
- POST /command -> body { message: "texto" } -> { reply: "..." }

Deploy no Deta Space (resumo)
1) Instale o Space CLI: https://deta.space/docs/en/build/reference/cli
2) Inicialize o app:
   - cd api
   - space new
     Escolha o tipo "Micro" (Python)
3) Configure o entrypoint (Procfile ou Spacefile) se necessário.
4) space push
5) space release

CORS
- Configure a env CORS_ORIGINS com os domínios do seu front (ex: https://seuusuario.github.io)

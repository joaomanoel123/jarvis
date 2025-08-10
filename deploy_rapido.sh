#!/bin/bash

# 🚀 Deploy Rápido - João Manoel
# Usuário: joaomanoel123 | Repo: jarvis

echo "🤖 Deploy Rápido do Jarvis - João Manoel"
echo "========================================"
echo ""

# Configurações pré-definidas
GITHUB_USER="joaomanoel123"
REPO_NAME="jarvis"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
SITE_URL="https://$GITHUB_USER.github.io/$REPO_NAME"

echo "👤 Usuário: $GITHUB_USER"
echo "📁 Repositório: $REPO_NAME"
echo "🌐 URL final: $SITE_URL"
echo ""

# Verificações básicas
if [ ! -f "main.py" ]; then
    echo "❌ Erro: Execute na pasta raiz do projeto Jarvis"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git não instalado"
    exit 1
fi

echo "✅ Verificações OK"

# Configurar Git
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando Git..."
    git init
fi

# Configurar remote
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
echo "✅ Repositório configurado"

# Commit e push
echo "📦 Preparando arquivos..."
git add .

git commit -m "🚀 Deploy Jarvis - João Manoel

✨ Assistente virtual com:
- Interface futurista
- IA com Groq API
- PWA instalável
- 100% português
- Personalizado para João Manoel

🌐 $SITE_URL"

echo "🚀 Enviando para GitHub..."

# Tentar push
if git push -u origin main 2>/dev/null; then
    echo "✅ Enviado com sucesso!"
elif git branch -M main && git push -u origin main 2>/dev/null; then
    echo "✅ Enviado com sucesso (main)!"
elif git push -u origin main --force-with-lease; then
    echo "✅ Enviado com sucesso (força)!"
else
    echo "❌ Erro no envio. Verifique credenciais."
    exit 1
fi

echo ""
echo "🎉 DEPLOY CONCLUÍDO!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "2. Vá em Settings > Pages"
echo "3. Selecione 'GitHub Actions' em Source"
echo "4. Aguarde 5 minutos"
echo ""
echo "🔗 Seu Jarvis estará em: $SITE_URL"
echo ""
echo "🤖 Jarvis de João Manoel está quase online! 🚀"
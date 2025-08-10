#!/bin/bash

# Script de Deploy Completo - Render + GitHub Pages
# Jarvis Web - João Manoel

echo "🚀 Deploy Completo: Render + GitHub Pages"
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "api" ] || [ ! -d "docs" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto jarvis."
    exit 1
fi

echo "📋 Configuração atual:"
echo "   Frontend: https://joaomanoel123.github.io/jarvis"
echo "   Backend:  https://jarvis-tdgt.onrender.com"
echo ""

# Verificar status do git
echo "📋 Verificando status do repositório..."
git status

echo ""
echo "📦 Adicionando arquivos atualizados..."
git add .

# Verificar se há mudanças para commit
if git diff --staged --quiet; then
    echo "ℹ️ Nenhuma mudança detectada para commit."
else
    echo "💾 Fazendo commit das mudanças..."
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    git commit -m "🔐 Configure Render API integration

- Update API URL to https://jarvis-tdgt.onrender.com
- Secure Google API key configuration for Render
- Enhanced error handling and connection testing
- CORS configured for GitHub Pages
- Complete Render setup documentation

Deploy: $TIMESTAMP"
fi

echo ""
echo "🌐 Enviando para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "🔥 AÇÕES CRÍTICAS NECESSÁRIAS:"
    echo ""
    echo "1. 🚨 REVOGAR CHAVE ANTIGA (URGENTE):"
    echo "   https://console.cloud.google.com/apis/credentials"
    echo "   🗑️ DELETE: AIzaSyB7BqIE33TU5VKdK62J7AfrkmR1-yAnhkQ"
    echo ""
    echo "2. 🔑 GERAR NOVA CHAVE:"
    echo "   - CREATE CREDENTIALS > API Key"
    echo "   - Configurar restrições de domínio"
    echo "   - Habilitar Generative Language API"
    echo ""
    echo "3. ⚙️ CONFIGURAR NO RENDER:"
    echo "   https://dashboard.render.com"
    echo "   Adicionar variáveis de ambiente:"
    echo "   - GOOGLE_API_KEY = SUA_NOVA_CHAVE"
    echo "   - CORS_ORIGINS = https://joaomanoel123.github.io,https://joaomanoel123.github.io/jarvis"
    echo "   - ENVIRONMENT = production"
    echo ""
    echo "4. 🧪 TESTAR:"
    echo "   - API: https://jarvis-tdgt.onrender.com/health"
    echo "   - Site: https://joaomanoel123.github.io/jarvis"
    echo ""
    echo "⏱️ Aguarde alguns minutos para:"
    echo "   - GitHub Pages processar o deploy"
    echo "   - Render inicializar a API"
    echo ""
    echo "🔍 Monitoramento:"
    echo "   - GitHub Actions: https://github.com/joaomanoel123/jarvis/actions"
    echo "   - Render Logs: https://dashboard.render.com"
else
    echo ""
    echo "❌ Erro no push para GitHub!"
    echo "Verifique sua conexão e configurações do git."
    exit 1
fi

echo ""
echo "🎉 Deploy configurado! Siga as ações críticas acima."
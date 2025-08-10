#!/bin/bash

# Script para deploy das correções de debug da API
# Jarvis - João Manoel

echo "🔧 Deploy das correções de debug da API"
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "api" ] || [ ! -d "docs" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto jarvis."
    exit 1
fi

echo "📋 Correções implementadas:"
echo "   ✅ Logs detalhados na API"
echo "   ✅ Tratamento específico de erros"
echo "   ✅ Debug endpoint (/debug)"
echo "   ✅ Frontend com melhor feedback"
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
    git commit -m "🔧 API Debug: Enhanced error handling and logging

- Added detailed logging to API endpoints
- Specific error handling for different failure types
- Debug endpoint for development environment
- Enhanced frontend error display with details
- Better Google Gemini API error detection
- Improved timeout and network error handling

Deploy: $TIMESTAMP"
fi

echo ""
echo "🌐 Enviando para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "🔍 PRÓXIMOS PASSOS PARA DEBUG:"
    echo ""
    echo "1. 📊 Verificar logs do Render:"
    echo "   https://dashboard.render.com"
    echo "   → Seu serviço → Logs"
    echo ""
    echo "2. 🧪 Testar mensagem novamente:"
    echo "   https://joaomanoel123.github.io/jarvis"
    echo "   → Digite uma mensagem"
    echo "   → Veja os logs detalhados no console (F12)"
    echo ""
    echo "3. 🔧 Debug endpoint (desenvolvimento):"
    echo "   https://jarvis-tdgt.onrender.com/debug"
    echo ""
    echo "4. 📋 Health check:"
    echo "   https://jarvis-tdgt.onrender.com/health"
    echo ""
    echo "⏱️ Aguarde alguns minutos para:"
    echo "   - GitHub Pages processar o deploy"
    echo "   - Render atualizar a API"
    echo ""
    echo "🔍 Com os logs detalhados, poderemos identificar exatamente o problema!"
else
    echo ""
    echo "❌ Erro no push para GitHub!"
    echo "Verifique sua conexão e configurações do git."
    exit 1
fi

echo ""
echo "🎯 Deploy de debug concluído!"
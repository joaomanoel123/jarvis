#!/bin/bash

# Script para deploy da migração para Groq API
# Jarvis - João Manoel

echo "⚡ Deploy da migração para Groq API"
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "api" ] || [ ! -d "docs" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto jarvis."
    exit 1
fi

echo "🚀 Funcionalidades implementadas:"
echo "   ⚡ Groq API como provedor principal"
echo "   🤖 Google Gemini como fallback"
echo "   📊 Health check com informações do provedor"
echo "   🔧 Debug endpoint atualizado"
echo "   🎯 Frontend com indicador de provedor"
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
    git commit -m "⚡ Groq API Integration: Ultra-fast AI responses

🚀 Features:
- Groq API as primary provider (llama3-8b-8192)
- Google Gemini as fallback
- Automatic provider selection and fallback
- Enhanced health check with provider info
- Updated frontend with provider indicators
- Comprehensive error handling for both APIs

🔧 Technical:
- OpenAI-compatible Groq API integration
- ~200-500ms response times vs 1-3s
- Detailed logging for both providers
- Environment variable priority system
- CORS and security maintained

⚡ Performance:
- 5-10x faster responses with Groq
- Better rate limits and reliability
- Seamless fallback to Google if needed

Deploy: $TIMESTAMP"
fi

echo ""
echo "🌐 Enviando para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "⚡ CONFIGURAÇÃO DA GROQ API:"
    echo ""
    echo "1. 🔑 Obter chave da Groq:"
    echo "   https://console.groq.com"
    echo "   → API Keys → Create API Key"
    echo ""
    echo "2. ⚙️ Configurar no Render:"
    echo "   https://dashboard.render.com"
    echo "   → Seu serviço → Environment"
    echo "   → Adicionar: GROQ_API_KEY = gsk_sua_chave_aqui"
    echo ""
    echo "3. 🧪 Testar configuração:"
    echo "   Health: https://jarvis-tdgt.onrender.com/health"
    echo "   Debug:  https://jarvis-tdgt.onrender.com/debug"
    echo "   Site:   https://joaomanoel123.github.io/jarvis"
    echo ""
    echo "📊 VANTAGENS DO GROQ:"
    echo "   ⚡ 5-10x mais rápido que Google Gemini"
    echo "   🆓 Tier gratuito generoso"
    echo "   🔄 Menos problemas de rate limiting"
    echo "   🤖 Modelo Llama 3 de alta qualidade"
    echo ""
    echo "🔄 SISTEMA DE FALLBACK:"
    echo "   1º Groq (se GROQ_API_KEY configurada)"
    echo "   2º Google (se GOOGLE_API_KEY configurada)"
    echo "   3º Erro (se nenhuma configurada)"
    echo ""
    echo "⏱️ Aguarde alguns minutos para:"
    echo "   - GitHub Pages processar o deploy"
    echo "   - Render atualizar a API"
    echo ""
    echo "🎯 Após configurar a chave Groq, teste uma mensagem!"
    echo "   Você verá respostas muito mais rápidas! ⚡"
else
    echo ""
    echo "❌ Erro no push para GitHub!"
    echo "Verifique sua conexão e configurações do git."
    exit 1
fi

echo ""
echo "⚡ Deploy da migração Groq concluído!"
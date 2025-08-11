#!/bin/bash

# 🗣️ Deploy do Jarvis TTS - Voz Cristalina
# Script para fazer deploy das melhorias de TTS

echo "🤖 ========================================"
echo "🗣️  JARVIS TTS - DEPLOY DE VOZ CRISTALINA"
echo "🤖 ========================================"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docs/index.html" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Jarvis"
    exit 1
fi

# Verificar se os arquivos TTS existem
if [ ! -f "docs/jarvis-tts.js" ]; then
    echo "❌ Erro: Arquivo jarvis-tts.js não encontrado"
    exit 1
fi

echo "✅ Verificações iniciais concluídas"
echo ""

# Mostrar status atual
echo "📊 Status atual do repositório:"
git status --short
echo ""

# Adicionar arquivos
echo "📁 Adicionando arquivos..."
git add docs/jarvis-tts.js
git add docs/main.js
git add docs/index.html
git add docs/test-tts-integration.html
git add JARVIS_TTS_INTEGRADO.md
git add RESUMO_TTS_IMPLEMENTACAO.md
git add deploy-jarvis-tts.sh

echo "✅ Arquivos adicionados"
echo ""

# Verificar mudanças
echo "📋 Mudanças a serem commitadas:"
git diff --cached --name-only
echo ""

# Confirmar com o usuário
read -p "🤔 Deseja continuar com o deploy? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado pelo usuário"
    exit 1
fi

# Fazer commit
echo "💾 Fazendo commit..."
COMMIT_MSG="🗣️ Jarvis TTS integrado - Voz cristalina ativada!

✨ Funcionalidades adicionadas:
- 🎤 Web Speech API nativa (100% gratuita)
- 🇧🇷 Auto-seleção de voz em português brasileiro
- ⚙️ Configurações avançadas (velocidade, tom, volume)
- 🔊 Auto-speak para todas as respostas
- 🎮 Controles integrados na interface
- 📱 Compatível com GitHub Pages
- 🧪 Página de teste incluída

🚀 Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo "✅ Commit realizado com sucesso"
else
    echo "❌ Erro no commit"
    exit 1
fi

echo ""

# Push para o repositório
echo "🚀 Fazendo push para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Push realizado com sucesso!"
else
    echo "❌ Erro no push"
    exit 1
fi

echo ""
echo "🎉 ========================================"
echo "🗣️  DEPLOY CONCLUÍDO COM SUCESSO!"
echo "🎉 ========================================"
echo ""
echo "🌐 Seu Jarvis com voz estará disponível em:"
echo "   https://joaomanoel123.github.io/jarvis"
echo ""
echo "🧪 Página de teste TTS:"
echo "   https://joaomanoel123.github.io/jarvis/test-tts-integration.html"
echo ""
echo "⏱️  Aguarde alguns minutos para o GitHub Pages atualizar"
echo ""
echo "🎯 Funcionalidades ativadas:"
echo "   ✅ Voz cristalina em português"
echo "   ✅ Configurações avançadas"
echo "   ✅ Auto-speak das respostas"
echo "   ✅ Controles na interface"
echo "   ✅ 100% gratuito e offline"
echo ""
echo "🤖 Seu Jarvis agora fala! Aproveite! 🗣️"
echo ""
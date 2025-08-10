#!/bin/bash

# Script de Deploy Corrigido para GitHub Pages
# Jarvis Web - João Manoel

echo "🚀 Iniciando deploy corrigido do Jarvis Web para GitHub Pages..."
echo ""

# Verificar se estamos no diretório correto
if [ ! -d "docs" ]; then
    echo "❌ Erro: Pasta 'docs' não encontrada!"
    echo "Execute este script na raiz do projeto jarvis."
    exit 1
fi

# Verificar se git está inicializado
if [ ! -d ".git" ]; then
    echo "❌ Erro: Repositório git não encontrado!"
    echo "Inicialize o git primeiro com: git init"
    exit 1
fi

# Verificar se estamos na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Você não está na branch main. Mudando para main..."
    git checkout main
fi

# Atualizar o cache buster
echo "📝 Atualizando cache buster..."
echo "Cache buster for GitHub Pages deployment" > docs/cache-buster.txt
echo "Generated at: $(date '+%Y-%m-%d %H:%M:%S')" >> docs/cache-buster.txt
echo "Build ID: jarvis-v1.0.0-$(date '+%Y%m%d%H%M%S')" >> docs/cache-buster.txt

# Verificar status do git
echo "📋 Verificando status do repositório..."
git status

echo ""
echo "📦 Adicionando arquivos do Jarvis Web..."
git add .

# Verificar se há mudanças para commit
if git diff --staged --quiet; then
    echo "ℹ️ Nenhuma mudança detectada para commit."
    exit 0
fi

echo "💾 Fazendo commit das mudanças..."
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "🚀 Deploy GitHub Pages Fix - $TIMESTAMP

- Corrigido workflow do GitHub Actions
- Atualizado cache buster
- Otimizado para melhor compatibilidade
- Removido configurações desnecessárias

Deploy automático via script"

echo ""
echo "🌐 Enviando para GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "📋 Verificações importantes:"
    echo "1. Acesse: https://github.com/joaomanoel123/jarvis/actions"
    echo "2. Verifique se o workflow está executando sem erros"
    echo "3. Aguarde a conclusão do deploy"
    echo ""
    echo "🌟 Seu Jarvis Web estará disponível em:"
    echo "   https://joaomanoel123.github.io/jarvis"
    echo ""
    echo "⏱️ Aguarde alguns minutos para o GitHub processar o deploy."
    echo ""
    echo "🔧 Se ainda houver problemas:"
    echo "   - Verifique as configurações do GitHub Pages"
    echo "   - Confirme que a source está configurada para GitHub Actions"
    echo "   - Verifique os logs do workflow no GitHub Actions"
else
    echo ""
    echo "❌ Erro no push para GitHub!"
    echo "Verifique sua conexão e configurações do git."
    exit 1
fi

echo ""
echo "🎉 Deploy corrigido concluído!"
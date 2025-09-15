#!/bin/bash

echo "🚀 Verificando Deploy do GitHub Pages - J.A.R.V.I.S"
echo "================================================="
echo ""

# Verificar se o commit foi feito
echo "📋 Último commit:"
git log --oneline -1
echo ""

# Verificar status do repositório
echo "📊 Status do Git:"
git status --porcelain
echo ""

# Verificar se o push foi feito
echo "🔄 Verificando se está sincronizado com origin:"
git status -uno
echo ""

# Tentar acessar o GitHub Pages
echo "🌐 Testando acesso ao GitHub Pages..."
echo "URL: https://joaomanoel123.github.io/jarvis/"
echo ""

# Verificar se o arquivo de teste existe
if [ -f "docs/test-loading-screen-fix.html" ]; then
    echo "✅ Arquivo de teste criado: docs/test-loading-screen-fix.html"
else
    echo "❌ Arquivo de teste não encontrado"
fi

# Verificar se as correções estão nos arquivos
echo ""
echo "🔍 Verificando correções aplicadas:"

if grep -q "fade-out" docs/style.css; then
    echo "✅ Classe .fade-out encontrada no style.css"
else
    echo "❌ Classe .fade-out NÃO encontrada no style.css"
fi

if grep -q "fade-out" docs/index.html; then
    echo "✅ Script de fade-out encontrado no index.html"
else
    echo "❌ Script de fade-out NÃO encontrado no index.html"
fi

echo ""
echo "📝 Próximos passos:"
echo "1. Aguarde alguns minutos para o GitHub Pages processar o deploy"
echo "2. Acesse: https://joaomanoel123.github.io/jarvis/"
echo "3. Teste: https://joaomanoel123.github.io/jarvis/test-loading-screen-fix.html"
echo "4. Abra o console do navegador para ver os logs de debug"
echo ""
echo "🎯 A correção da tela de carregamento deve estar funcionando!"
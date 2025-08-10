#!/bin/bash

# Script para remover chaves API do histórico do Git
# ATENÇÃO: Isso reescreve o histórico do Git!

echo "🚨 LIMPEZA DE SEGURANÇA DO HISTÓRICO GIT"
echo ""
echo "⚠️  ATENÇÃO: Este script irá reescrever o histórico do Git!"
echo "⚠️  Isso pode quebrar clones existentes do repositório."
echo ""
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " confirm

if [ "$confirm" != "SIM" ]; then
    echo "❌ Operação cancelada."
    exit 1
fi

echo ""
echo "🔄 Removendo chaves API do histórico..."

# Remover a chave específica do histórico
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch engine/cookies.json' \
--prune-empty --tag-name-filter cat -- --all

# Limpar referências
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo ""
echo "✅ Histórico limpo!"
echo ""
echo "🚀 Próximos passos:"
echo "1. git push --force-with-lease origin main"
echo "2. Avisar colaboradores para fazer fresh clone"
echo ""
echo "⚠️  IMPORTANTE: Ainda é necessário revogar a chave no Google Console!"
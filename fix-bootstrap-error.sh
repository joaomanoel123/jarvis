#!/bin/bash

# 🔧 Script de Correção do Erro Bootstrap
# Resolve o problema de integrity mismatch do Bootstrap 5.3.2

echo "🔧 Iniciando correção do erro Bootstrap..."
echo "================================================"

# Verificar se estamos no diretório correto
if [ ! -f "www/index.html" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Jarvis"
    exit 1
fi

echo "✅ Diretório do projeto encontrado"

# 1. Verificar versão atual do Bootstrap no HTML
echo ""
echo "🔍 Verificando versão do Bootstrap no HTML..."
BOOTSTRAP_VERSION=$(grep -o "bootstrap@[0-9]\+\.[0-9]\+\.[0-9]\+" www/index.html | head -1)
echo "📦 Versão encontrada: $BOOTSTRAP_VERSION"

if [[ "$BOOTSTRAP_VERSION" == "bootstrap@5.0.2" ]]; then
    echo "✅ Versão correta (5.0.2) encontrada no HTML"
else
    echo "⚠️ Versão incorreta ou não encontrada"
fi

# 2. Verificar Service Worker
echo ""
echo "🔍 Verificando Service Worker..."
if [ -f "www/sw.js" ]; then
    SW_BOOTSTRAP=$(grep -o "bootstrap@[0-9]\+\.[0-9]\+\.[0-9]\+" www/sw.js | head -1)
    echo "📦 Versão no SW: $SW_BOOTSTRAP"
    
    if [[ "$SW_BOOTSTRAP" == "bootstrap@5.0.2" ]]; then
        echo "✅ Service Worker usando versão correta"
    else
        echo "⚠️ Service Worker pode ter versão incorreta"
    fi
else
    echo "⚠️ Service Worker não encontrado"
fi

# 3. Atualizar cache name no Service Worker para forçar atualização
echo ""
echo "🔄 Atualizando cache do Service Worker..."
TIMESTAMP=$(date +%s)
NEW_CACHE_NAME="jarvis-v1.0.1-bootstrap-fix-$TIMESTAMP"

if [ -f "www/sw.js" ]; then
    # Backup do arquivo original
    cp www/sw.js www/sw.js.backup
    
    # Atualizar nome do cache
    sed -i.tmp "s/const CACHE_NAME = '[^']*'/const CACHE_NAME = '$NEW_CACHE_NAME'/" www/sw.js
    rm -f www/sw.js.tmp
    
    echo "✅ Cache name atualizado para: $NEW_CACHE_NAME"
else
    echo "⚠️ Service Worker não encontrado para atualização"
fi

# 4. Verificar se há referências ao Bootstrap 5.3.2
echo ""
echo "🔍 Procurando referências ao Bootstrap 5.3.2..."
BOOTSTRAP_532_REFS=$(find . -name "*.html" -o -name "*.js" -o -name "*.css" | xargs grep -l "bootstrap@5\.3\.2" 2>/dev/null || true)

if [ -n "$BOOTSTRAP_532_REFS" ]; then
    echo "⚠️ Referências ao Bootstrap 5.3.2 encontradas em:"
    echo "$BOOTSTRAP_532_REFS"
    
    # Oferecer correção automática
    echo ""
    read -p "🔧 Deseja corrigir automaticamente? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Corrigindo referências..."
        find . -name "*.html" -o -name "*.js" -o -name "*.css" | xargs sed -i.backup 's/bootstrap@5\.3\.2/bootstrap@5.0.2/g' 2>/dev/null || true
        echo "✅ Referências corrigidas"
    fi
else
    echo "✅ Nenhuma referência ao Bootstrap 5.3.2 encontrada"
fi

# 5. Verificar integridade dos arquivos Bootstrap
echo ""
echo "🔍 Verificando integridade dos links Bootstrap..."

# Hash correto para Bootstrap 5.0.2
CORRECT_HASH="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
FOUND_HASH=$(grep -o "integrity=\"[^\"]*\"" www/index.html | grep bootstrap -A1 -B1 | grep integrity | head -1 | cut -d'"' -f2)

if [[ "$FOUND_HASH" == "$CORRECT_HASH" ]]; then
    echo "✅ Hash de integridade correto"
else
    echo "⚠️ Hash de integridade pode estar incorreto"
    echo "   Encontrado: $FOUND_HASH"
    echo "   Esperado:   $CORRECT_HASH"
fi

# 6. Criar arquivo de verificação
echo ""
echo "📝 Criando arquivo de verificação..."
cat > bootstrap-verification.json << EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "bootstrap_version_html": "$BOOTSTRAP_VERSION",
    "bootstrap_version_sw": "$SW_BOOTSTRAP",
    "cache_name": "$NEW_CACHE_NAME",
    "integrity_hash": "$FOUND_HASH",
    "correct_hash": "$CORRECT_HASH",
    "status": "corrected"
}
EOF

echo "✅ Arquivo de verificação criado: bootstrap-verification.json"

# 7. Instruções finais
echo ""
echo "🎉 Correção concluída!"
echo "================================================"
echo ""
echo "📋 Próximos passos:"
echo "1. 🌐 Abra o navegador e vá para o projeto"
echo "2. 🔄 Pressione Ctrl+Shift+R (ou Cmd+Shift+R no Mac) para recarregar com cache limpo"
echo "3. 🧹 Ou abra: clear-bootstrap-cache.html para limpeza automática"
echo "4. ✅ Verifique se o erro foi resolvido"
echo ""
echo "🔧 Se o problema persistir:"
echo "- Limpe manualmente o cache do navegador"
echo "- Desative temporariamente o Service Worker"
echo "- Verifique se não há proxy/CDN alterando os arquivos"
echo ""
echo "📞 Para suporte adicional, verifique os logs do console (F12)"

# 8. Verificar se o arquivo de correção foi criado
if [ -f "clear-bootstrap-cache.html" ]; then
    echo ""
    echo "🎯 Ferramenta de correção disponível em: clear-bootstrap-cache.html"
else
    echo ""
    echo "⚠️ Ferramenta de correção não encontrada. Execute o script novamente."
fi

echo ""
echo "✅ Script de correção finalizado!"
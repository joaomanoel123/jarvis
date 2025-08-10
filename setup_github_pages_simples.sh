#!/bin/bash

# 🚀 Script Simples para GitHub Pages - João Manoel
# Versão simplificada e direta

echo "🤖 JARVIS - Setup GitHub Pages Simples"
echo "======================================"
echo "Configurado especialmente para João Manoel"
echo ""

# Verificar se estamos na pasta correta
if [ ! -f "main.py" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto Jarvis"
    exit 1
fi

echo "📋 Verificando pré-requisitos..."

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não está instalado. Instale o Git primeiro."
    exit 1
fi

echo "✅ Git encontrado"

# Verificar se já é um repositório git
if [ ! -d ".git" ]; then
    echo "🔧 Inicializando repositório Git..."
    git init
    echo "✅ Repositório Git inicializado"
else
    echo "✅ Repositório Git já existe"
fi

# Solicitar informações do usuário
echo ""
echo "📝 Configuração do GitHub:"
read -p "Digite seu nome de usuário do GitHub: " GITHUB_USER
read -p "Digite o nome do repositório (padrão: jarvis): " REPO_NAME
REPO_NAME=${REPO_NAME:-jarvis}

echo ""
echo "🔧 Configurando repositório remoto..."

# Remover origin existente se houver
git remote remove origin 2>/dev/null || true

# Adicionar novo origin
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
echo "✅ Repositório remoto configurado: https://github.com/$GITHUB_USER/$REPO_NAME"

# Verificar se há mudanças para commit
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "📦 Preparando arquivos para commit..."
    
    # Adicionar todos os arquivos
    git add .
    
    # Fazer commit
    echo "💾 Fazendo commit..."
    git commit -m "🚀 Deploy inicial do Jarvis para GitHub Pages

✨ Funcionalidades:
- Interface web moderna
- Integração com Groq API
- Suporte a português brasileiro
- Chat interativo
- Design futurista do Jarvis

🤖 Configurado especialmente para João Manoel"
    
    echo "✅ Commit realizado"
else
    echo "ℹ️ Nenhuma mudança para commit"
fi

echo ""
echo "🚀 Enviando para GitHub..."

# Tentar push
if git push -u origin main 2>/dev/null; then
    echo "✅ Código enviado com sucesso!"
elif git push -u origin main --force-with-lease 2>/dev/null; then
    echo "✅ Código enviado com sucesso (força)!"
else
    echo "❌ Erro ao enviar código. Verifique:"
    echo "   1. Se o repositório existe no GitHub"
    echo "   2. Se você tem permissões de escrita"
    echo "   3. Se suas credenciais estão corretas"
    exit 1
fi

echo ""
echo "🌐 Configurando GitHub Pages..."
echo "📋 Passos manuais necessários:"
echo "   1. Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "   2. Vá em Settings > Pages"
echo "   3. Em Source, selecione 'GitHub Actions'"
echo "   4. O deploy será automático!"
echo ""
echo "⏱️ Aguarde 2-5 minutos para o deploy"
echo "🔗 Seu Jarvis estará em: https://$GITHUB_USER.github.io/$REPO_NAME"
echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📚 Próximos passos:"
echo "   • Leia: DEPLOY_GITHUB_PAGES_JOAO_MANOEL.md"
echo "   • Configure API no Render (opcional)"
echo "   • Teste sua URL do GitHub Pages"
echo ""
echo "🤖 Jarvis configurado especialmente para João Manoel!"
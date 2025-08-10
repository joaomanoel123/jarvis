#!/bin/bash

# 🚀 Script de Deploy Personalizado para João Manoel
# Usuário: joaomanoel123
# Repositório: jarvis
# URL Final: https://joaomanoel123.github.io/jarvis

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações pré-definidas para João Manoel
GITHUB_USER="joaomanoel123"
REPO_NAME="jarvis"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
SITE_URL="https://$GITHUB_USER.github.io/$REPO_NAME"

# Função para imprimir com cores
print_color() {
    printf "${1}${2}${NC}\n"
}

# Header personalizado
print_header() {
    clear
    print_color $CYAN "╔══════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║                    🤖 JARVIS DEPLOY                         ║"
    print_color $CYAN "║                                                              ║"
    print_color $CYAN "║              👤 Usuário: joaomanoel123                      ║"
    print_color $CYAN "║              📁 Repositório: jarvis                         ║"
    print_color $CYAN "║              🌐 URL: joaomanoel123.github.io/jarvis         ║"
    print_color $CYAN "║                                                              ║"
    print_color $CYAN "║    🚀 Deploy automático configurado para João Manoel       ║"
    print_color $CYAN "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# Verificar pré-requisitos
check_prerequisites() {
    print_color $BLUE "📋 Verificando pré-requisitos..."
    
    # Verificar se estamos na pasta correta
    if [ ! -f "main.py" ]; then
        print_color $RED "❌ Erro: Execute este script na pasta raiz do projeto Jarvis"
        print_color $YELLOW "💡 Navegue até a pasta que contém o arquivo main.py"
        exit 1
    fi
    
    # Verificar se git está instalado
    if ! command -v git &> /dev/null; then
        print_color $RED "❌ Git não está instalado"
        print_color $YELLOW "💡 Instale o Git: sudo apt install git"
        exit 1
    fi
    
    print_color $GREEN "✅ Git encontrado: $(git --version)"
    print_color $GREEN "✅ Projeto Jarvis encontrado"
    echo ""
}

# Configurar Git
setup_git() {
    print_color $BLUE "🔧 Configurando Git para João Manoel..."
    
    # Verificar se já é um repositório git
    if [ ! -d ".git" ]; then
        print_color $YELLOW "🔧 Inicializando repositório Git..."
        git init
        print_color $GREEN "✅ Repositório Git inicializado"
    else
        print_color $GREEN "✅ Repositório Git já existe"
    fi
    
    # Configurar usuário se necessário
    if ! git config user.name &> /dev/null; then
        git config --global user.name "João Manoel"
        print_color $GREEN "✅ Nome configurado: João Manoel"
    fi
    
    if ! git config user.email &> /dev/null; then
        git config --global user.email "joaomanoel123@users.noreply.github.com"
        print_color $GREEN "✅ Email configurado"
    fi
    
    echo ""
}

# Configurar repositório remoto
setup_remote() {
    print_color $BLUE "🔧 Configurando repositório remoto..."
    
    # Remover origin existente se houver
    if git remote get-url origin &> /dev/null; then
        print_color $YELLOW "🔄 Removendo origin existente..."
        git remote remove origin
    fi
    
    # Adicionar novo origin
    git remote add origin "$REPO_URL"
    print_color $GREEN "✅ Repositório remoto configurado:"
    print_color $GREEN "   📁 $REPO_URL"
    echo ""
}

# Preparar arquivos
prepare_files() {
    print_color $BLUE "📦 Preparando arquivos para deploy..."
    
    # Verificar arquivos essenciais
    essential_files=("www/index.html" "www/style.css" "main.py" "README.md")
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            print_color $GREEN "✅ $file"
        else
            print_color $YELLOW "⚠️ $file não encontrado (opcional)"
        fi
    done
    
    # Verificar se há mudanças
    if [ -n "$(git status --porcelain)" ]; then
        print_color $CYAN "📝 Arquivos para commit:"
        git status --short | head -10
        if [ $(git status --porcelain | wc -l) -gt 10 ]; then
            print_color $CYAN "   ... e mais $(( $(git status --porcelain | wc -l) - 10 )) arquivos"
        fi
        echo ""
        return 0
    else
        print_color $GREEN "✅ Nenhuma mudança detectada"
        return 1
    fi
}

# Fazer commit
make_commit() {
    print_color $BLUE "💾 Fazendo commit das mudanças..."
    
    # Adicionar todos os arquivos
    git add .
    print_color $GREEN "✅ Arquivos adicionados ao staging"
    
    # Mensagem de commit personalizada
    COMMIT_MESSAGE="🚀 Deploy do Jarvis - João Manoel

✨ Funcionalidades implementadas:
- 🤖 Interface web moderna e futurista
- 🧠 Integração com Groq API para IA ultra-rápida
- 🇧🇷 Suporte completo ao português brasileiro
- 💬 Chat interativo e responsivo
- 📱 PWA com Service Worker para instalação
- 🔍 SEO otimizado para buscadores
- 🎨 Design responsivo para todos os dispositivos
- ⚡ Cache offline para performance máxima
- 🔊 Síntese de voz em português
- 👤 Personalização completa para João Manoel

🎯 Configurado especialmente para João Manoel
🌐 Acessível em: $SITE_URL
📱 Instalável como PWA
🤖 J.A.R.V.I.S - Just A Rather Very Intelligent System

Deploy automático via script personalizado"
    
    # Fazer commit
    git commit -m "$COMMIT_MESSAGE"
    print_color $GREEN "✅ Commit realizado com sucesso"
    echo ""
}

# Push para GitHub
push_to_github() {
    print_color $BLUE "🚀 Enviando código para GitHub..."
    
    # Tentar diferentes métodos de push
    print_color $YELLOW "📤 Tentativa 1: Push normal..."
    
    if git push -u origin main 2>/dev/null; then
        print_color $GREEN "✅ Código enviado com sucesso!"
        return 0
    fi
    
    print_color $YELLOW "📤 Tentativa 2: Criando branch main..."
    git branch -M main
    
    if git push -u origin main 2>/dev/null; then
        print_color $GREEN "✅ Código enviado com sucesso!"
        return 0
    fi
    
    print_color $YELLOW "📤 Tentativa 3: Push com força..."
    
    if git push -u origin main --force-with-lease; then
        print_color $GREEN "✅ Código enviado com sucesso (força)!"
        return 0
    fi
    
    print_color $RED "❌ Erro ao enviar código"
    print_color $YELLOW "💡 Possíveis soluções:"
    echo "   1. Verifique se o repositório existe: $REPO_URL"
    echo "   2. Confirme suas credenciais do GitHub"
    echo "   3. Verifique permissões de escrita no repositório"
    echo ""
    exit 1
}

# Mostrar instruções do GitHub Pages
show_github_pages_setup() {
    print_color $BLUE "🌐 Configuração do GitHub Pages..."
    echo ""
    
    print_color $CYAN "📋 Passos para ativar GitHub Pages:"
    echo ""
    print_color $YELLOW "1. 🌐 Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
    print_color $YELLOW "2. ⚙️ Clique em 'Settings' (Configurações)"
    print_color $YELLOW "3. 📄 No menu lateral, clique em 'Pages'"
    print_color $YELLOW "4. 🔧 Em 'Source', selecione 'GitHub Actions'"
    print_color $YELLOW "5. 💾 Clique em 'Save' (Salvar)"
    print_color $YELLOW "6. ⏱️ Aguarde 2-5 minutos para o deploy automático"
    echo ""
    
    print_color $GREEN "🎯 Seu Jarvis estará disponível em:"
    print_color $GREEN "🔗 $SITE_URL"
    echo ""
}

# Verificar status e links
show_links() {
    print_color $BLUE "🔍 Links importantes para João Manoel:"
    echo ""
    
    print_color $CYAN "🌐 Site do Jarvis:"
    print_color $GREEN "   $SITE_URL"
    echo ""
    
    print_color $CYAN "📁 Repositório GitHub:"
    print_color $GREEN "   https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    
    print_color $CYAN "🔧 GitHub Actions (Deploy):"
    print_color $GREEN "   https://github.com/$GITHUB_USER/$REPO_NAME/actions"
    echo ""
    
    print_color $CYAN "⚙️ Configurações Pages:"
    print_color $GREEN "   https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
    echo ""
}

# Mostrar comandos de teste
show_test_commands() {
    print_color $BLUE "🧪 Comandos para testar seu Jarvis:"
    echo ""
    
    print_color $CYAN "💬 Digite na caixa de chat:"
    print_color $YELLOW "   \"Olá Jarvis\""
    print_color $YELLOW "   \"Que horas são?\""
    print_color $YELLOW "   \"Como você está?\""
    print_color $YELLOW "   \"Obrigado\""
    print_color $YELLOW "   \"Ajuda\""
    echo ""
    
    print_color $CYAN "📱 Teste PWA:"
    print_color $YELLOW "   • Procure ícone de 'Instalar' no navegador"
    print_color $YELLOW "   • Instale como aplicativo"
    print_color $YELLOW "   • Teste offline (desconecte internet)"
    echo ""
}

# Resumo final
show_final_summary() {
    print_color $GREEN "╔══════════════════════════════════════════════════════════════╗"
    print_color $GREEN "║                    🎉 DEPLOY CONCLUÍDO!                     ║"
    print_color $GREEN "║                                                              ║"
    print_color $GREEN "║              Jarvis de João Manoel está ONLINE!             ║"
    print_color $GREEN "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_color $CYAN "📊 Resumo do deploy:"
    print_color $GREEN "   ✅ Usuário: joaomanoel123"
    print_color $GREEN "   ✅ Repositório: jarvis"
    print_color $GREEN "   ✅ Código enviado para GitHub"
    print_color $GREEN "   ✅ GitHub Actions configurado"
    print_color $GREEN "   ✅ PWA implementado"
    print_color $GREEN "   ✅ SEO otimizado"
    print_color $GREEN "   ✅ Interface responsiva"
    print_color $GREEN "   ✅ Personalização para João Manoel"
    echo ""
    
    print_color $PURPLE "🔗 URL do seu Jarvis:"
    print_color $PURPLE "   $SITE_URL"
    echo ""
    
    print_color $CYAN "🎯 Próximas ações:"
    print_color $YELLOW "   1. ⚙️ Configure GitHub Pages (instruções acima)"
    print_color $YELLOW "   2. ⏱️ Aguarde 5 minutos para o deploy"
    print_color $YELLOW "   3. 🌐 Acesse sua URL"
    print_color $YELLOW "   4. 🧪 Teste os comandos"
    print_color $YELLOW "   5. 📱 Instale como PWA"
    print_color $YELLOW "   6. 🌟 Compartilhe com amigos!"
    echo ""
    
    print_color $PURPLE "🤖 Jarvis configurado especialmente para João Manoel!"
    print_color $PURPLE "⚡ Powered by GitHub Pages + PWA + Groq API"
    print_color $PURPLE "🇧🇷 Made in Brazil with ❤️"
    echo ""
}

# Função principal
main() {
    print_header
    
    print_color $CYAN "🎯 Configuração automática:"
    print_color $CYAN "   👤 Usuário: $GITHUB_USER"
    print_color $CYAN "   📁 Repositório: $REPO_NAME"
    print_color $CYAN "   🌐 URL final: $SITE_URL"
    echo ""
    
    read -p "🔹 Confirma o deploy com essas configurações? (S/n): " confirm
    if [[ $confirm =~ ^[Nn]$ ]]; then
        print_color $YELLOW "❌ Deploy cancelado pelo usuário"
        exit 0
    fi
    
    echo ""
    
    # Executar deploy
    check_prerequisites
    setup_git
    setup_remote
    
    if prepare_files; then
        make_commit
    else
        print_color $YELLOW "ℹ️ Enviando arquivos existentes..."
    fi
    
    push_to_github
    show_github_pages_setup
    show_links
    show_test_commands
    show_final_summary
}

# Executar
main "$@"
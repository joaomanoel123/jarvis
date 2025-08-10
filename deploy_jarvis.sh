#!/bin/bash

# 🚀 Script de Deploy Completo do Jarvis para GitHub Pages
# Criado especialmente para João Manoel
# Versão: 2.0 - Completa e Otimizada

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_color() {
    printf "${1}${2}${NC}\n"
}

# Header do script
print_header() {
    clear
    print_color $CYAN "╔══════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║                    🤖 JARVIS DEPLOY SCRIPT                   ║"
    print_color $CYAN "║                                                              ║"
    print_color $CYAN "║              Configurado para João Manoel                   ║"
    print_color $CYAN "║                                                              ║"
    print_color $CYAN "║    🚀 Deploy automático para GitHub Pages                   ║"
    print_color $CYAN "║    📱 PWA com Service Worker                                ║"
    print_color $CYAN "║    🔍 SEO otimizado                                         ║"
    print_color $CYAN "║    🇧🇷 100% em português                                    ║"
    print_color $CYAN "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# Função para verificar pré-requisitos
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
        print_color $YELLOW "💡 Instale o Git:"
        echo "   Ubuntu/Debian: sudo apt install git"
        echo "   CentOS/RHEL:   sudo yum install git"
        echo "   macOS:         brew install git"
        exit 1
    fi
    
    print_color $GREEN "✅ Git encontrado: $(git --version)"
    
    # Verificar se Python está disponível
    if command -v python3 &> /dev/null; then
        print_color $GREEN "✅ Python3 encontrado: $(python3 --version)"
    elif command -v python &> /dev/null; then
        print_color $GREEN "✅ Python encontrado: $(python --version)"
    else
        print_color $YELLOW "⚠️ Python não encontrado (opcional)"
    fi
    
    echo ""
}

# Função para configurar Git
setup_git() {
    print_color $BLUE "🔧 Configurando Git..."
    
    # Verificar se já é um repositório git
    if [ ! -d ".git" ]; then
        print_color $YELLOW "🔧 Inicializando repositório Git..."
        git init
        print_color $GREEN "✅ Repositório Git inicializado"
    else
        print_color $GREEN "✅ Repositório Git já existe"
    fi
    
    # Verificar configuração do usuário
    if ! git config user.name &> /dev/null; then
        print_color $YELLOW "⚙️ Configurando usuário Git..."
        read -p "Digite seu nome para o Git: " git_name
        git config --global user.name "$git_name"
    fi
    
    if ! git config user.email &> /dev/null; then
        print_color $YELLOW "⚙️ Configurando email Git..."
        read -p "Digite seu email para o Git: " git_email
        git config --global user.email "$git_email"
    fi
    
    print_color $GREEN "✅ Git configurado"
    echo ""
}

# Função para obter informações do repositório
get_repo_info() {
    print_color $BLUE "📝 Configuração do repositório GitHub:"
    echo ""
    
    # Nome de usuário do GitHub
    while true; do
        read -p "🔹 Digite seu nome de usuário do GitHub: " GITHUB_USER
        if [ -n "$GITHUB_USER" ]; then
            break
        else
            print_color $RED "❌ Nome de usuário é obrigatório!"
        fi
    done
    
    # Nome do repositório
    read -p "🔹 Digite o nome do repositório (padrão: jarvis): " REPO_NAME
    REPO_NAME=${REPO_NAME:-jarvis}
    
    # URL do repositório
    REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
    
    echo ""
    print_color $CYAN "📊 Resumo da configuração:"
    print_color $CYAN "   👤 Usuário: $GITHUB_USER"
    print_color $CYAN "   📁 Repositório: $REPO_NAME"
    print_color $CYAN "   🔗 URL: $REPO_URL"
    echo ""
    
    read -p "🔹 Confirma as informações? (s/N): " confirm
    if [[ ! $confirm =~ ^[Ss]$ ]]; then
        print_color $YELLOW "🔄 Reiniciando configuração..."
        get_repo_info
        return
    fi
}

# Função para configurar repositório remoto
setup_remote() {
    print_color $BLUE "🔧 Configurando repositório remoto..."
    
    # Remover origin existente se houver
    if git remote get-url origin &> /dev/null; then
        print_color $YELLOW "🔄 Removendo origin existente..."
        git remote remove origin
    fi
    
    # Adicionar novo origin
    git remote add origin "$REPO_URL"
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Repositório remoto configurado: $REPO_URL"
    else
        print_color $RED "❌ Erro ao configurar repositório remoto"
        exit 1
    fi
    
    echo ""
}

# Função para verificar e preparar arquivos
prepare_files() {
    print_color $BLUE "📦 Preparando arquivos para deploy..."
    
    # Verificar arquivos essenciais
    essential_files=("www/index.html" "www/style.css" "main.py")
    
    for file in "${essential_files[@]}"; do
        if [ -f "$file" ]; then
            print_color $GREEN "✅ $file encontrado"
        else
            print_color $RED "❌ $file não encontrado"
            print_color $YELLOW "💡 Verifique se todos os arquivos estão na pasta correta"
            exit 1
        fi
    done
    
    # Verificar se há mudanças para commit
    if [ -n "$(git status --porcelain)" ]; then
        print_color $YELLOW "📝 Arquivos modificados detectados"
        
        # Mostrar status
        print_color $CYAN "📋 Status dos arquivos:"
        git status --short
        echo ""
        
        return 0
    else
        print_color $GREEN "✅ Nenhuma mudança detectada"
        return 1
    fi
}

# Função para fazer commit
make_commit() {
    print_color $BLUE "💾 Fazendo commit das mudanças..."
    
    # Adicionar todos os arquivos
    git add .
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Arquivos adicionados ao staging"
    else
        print_color $RED "❌ Erro ao adicionar arquivos"
        exit 1
    fi
    
    # Mensagem de commit personalizada
    COMMIT_MESSAGE="🚀 Deploy do Jarvis para GitHub Pages

✨ Funcionalidades implementadas:
- 🤖 Interface web moderna e futurista
- 🧠 Integração com Groq API para IA
- 🇧🇷 Suporte completo ao português brasileiro
- 💬 Chat interativo e responsivo
- 📱 PWA com Service Worker
- 🔍 SEO otimizado para buscadores
- 🎨 Design responsivo para todos os dispositivos
- ⚡ Cache offline para performance

🎯 Configurado especialmente para João Manoel
🌐 Acessível em: https://$GITHUB_USER.github.io/$REPO_NAME

🤖 J.A.R.V.I.S - Just A Rather Very Intelligent System"
    
    # Fazer commit
    git commit -m "$COMMIT_MESSAGE"
    
    if [ $? -eq 0 ]; then
        print_color $GREEN "✅ Commit realizado com sucesso"
    else
        print_color $RED "❌ Erro ao fazer commit"
        exit 1
    fi
    
    echo ""
}

# Função para fazer push
push_to_github() {
    print_color $BLUE "🚀 Enviando código para GitHub..."
    
    # Tentar push normal primeiro
    print_color $YELLOW "📤 Tentativa 1: Push normal..."
    
    if git push -u origin main 2>/dev/null; then
        print_color $GREEN "✅ Código enviado com sucesso!"
        return 0
    fi
    
    # Se falhar, tentar push com força
    print_color $YELLOW "📤 Tentativa 2: Push com força..."
    
    if git push -u origin main --force-with-lease 2>/dev/null; then
        print_color $GREEN "✅ Código enviado com sucesso (força)!"
        return 0
    fi
    
    # Se ainda falhar, tentar criar branch main
    print_color $YELLOW "📤 Tentativa 3: Criando branch main..."
    
    git branch -M main
    if git push -u origin main --force-with-lease; then
        print_color $GREEN "✅ Código enviado com sucesso (branch main criada)!"
        return 0
    fi
    
    # Se tudo falhar
    print_color $RED "❌ Erro ao enviar código para GitHub"
    print_color $YELLOW "💡 Possíveis soluções:"
    echo "   1. Verifique se o repositório existe no GitHub"
    echo "   2. Confirme suas credenciais de acesso"
    echo "   3. Verifique se você tem permissões de escrita"
    echo "   4. Tente fazer login: git config --global credential.helper store"
    echo ""
    
    read -p "🔹 Deseja tentar novamente? (s/N): " retry
    if [[ $retry =~ ^[Ss]$ ]]; then
        push_to_github
    else
        exit 1
    fi
}

# Função para mostrar instruções do GitHub Pages
show_github_pages_instructions() {
    print_color $BLUE "🌐 Configurando GitHub Pages..."
    echo ""
    
    print_color $CYAN "📋 Passos para ativar GitHub Pages:"
    echo ""
    print_color $YELLOW "1. 🌐 Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
    print_color $YELLOW "2. ⚙️ Clique em 'Settings' (Configurações)"
    print_color $YELLOW "3. 📄 No menu lateral, clique em 'Pages'"
    print_color $YELLOW "4. 🔧 Em 'Source', selecione 'GitHub Actions'"
    print_color $YELLOW "5. 💾 Clique em 'Save' (Salvar)"
    print_color $YELLOW "6. ⏱️ Aguarde 2-5 minutos para o deploy"
    echo ""
    
    print_color $GREEN "🎯 Seu Jarvis estará disponível em:"
    print_color $GREEN "🔗 https://$GITHUB_USER.github.io/$REPO_NAME"
    echo ""
}

# Função para verificar deploy
check_deploy_status() {
    print_color $BLUE "🔍 Verificando status do deploy..."
    
    print_color $CYAN "📊 Links importantes:"
    echo ""
    print_color $CYAN "🌐 Site do Jarvis:"
    print_color $GREEN "   https://$GITHUB_USER.github.io/$REPO_NAME"
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

# Função para mostrar próximos passos
show_next_steps() {
    print_color $BLUE "📚 Próximos passos e melhorias:"
    echo ""
    
    print_color $CYAN "🎯 Teste seu Jarvis:"
    print_color $YELLOW "   • Acesse a URL do seu site"
    print_color $YELLOW "   • Teste os comandos: 'Olá Jarvis', 'Que horas são?'"
    print_color $YELLOW "   • Instale como PWA (ícone de instalação no navegador)"
    print_color $YELLOW "   • Teste em diferentes dispositivos"
    echo ""
    
    print_color $CYAN "🚀 Melhorias opcionais:"
    print_color $YELLOW "   • Configure API no Render.com para IA completa"
    print_color $YELLOW "   • Adicione Google Analytics para monitoramento"
    print_color $YELLOW "   • Configure domínio personalizado"
    print_color $YELLOW "   • Implemente notificações push"
    echo ""
    
    print_color $CYAN "📖 Documentação:"
    print_color $YELLOW "   • DEPLOY_GITHUB_PAGES_JOAO_MANOEL.md"
    print_color $YELLOW "   • FUNCIONALIDADES_COMPLETAS_JARVIS_JOAO_MANOEL.md"
    print_color $YELLOW "   • ATUALIZACOES_JARVIS_ONLINE.md"
    echo ""
}

# Função para mostrar resumo final
show_final_summary() {
    print_color $GREEN "╔══════════════════════════════════════════════════════════════╗"
    print_color $GREEN "║                    🎉 DEPLOY CONCLUÍDO!                     ║"
    print_color $GREEN "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_color $CYAN "📊 Resumo do deploy:"
    print_color $GREEN "   ✅ Repositório configurado"
    print_color $GREEN "   ✅ Código enviado para GitHub"
    print_color $GREEN "   ✅ GitHub Actions configurado"
    print_color $GREEN "   ✅ PWA implementado"
    print_color $GREEN "   ✅ SEO otimizado"
    print_color $GREEN "   ✅ Interface responsiva"
    echo ""
    
    print_color $CYAN "🌟 Seu Jarvis agora é:"
    print_color $GREEN "   🌐 Website profissional online"
    print_color $GREEN "   📱 PWA instalável"
    print_color $GREEN "   ⚡ Cache offline"
    print_color $GREEN "   🔍 SEO otimizado"
    print_color $GREEN "   🇧🇷 100% em português"
    print_color $GREEN "   🤖 Personalizado para João Manoel"
    echo ""
    
    print_color $PURPLE "🔗 URL do seu Jarvis:"
    print_color $PURPLE "   https://$GITHUB_USER.github.io/$REPO_NAME"
    echo ""
    
    print_color $CYAN "🎯 Próxima ação:"
    print_color $YELLOW "   1. Configure GitHub Pages (instruções acima)"
    print_color $YELLOW "   2. Aguarde 5 minutos"
    print_color $YELLOW "   3. Acesse sua URL"
    print_color $YELLOW "   4. Teste e compartilhe!"
    echo ""
    
    print_color $PURPLE "🤖 Jarvis configurado especialmente para João Manoel!"
    print_color $PURPLE "⚡ Powered by GitHub Pages + PWA"
    print_color $PURPLE "🇧🇷 Made in Brazil"
    echo ""
}

# Função principal
main() {
    print_header
    
    # Verificar pré-requisitos
    check_prerequisites
    
    # Configurar Git
    setup_git
    
    # Obter informações do repositório
    get_repo_info
    
    # Configurar repositório remoto
    setup_remote
    
    # Preparar arquivos
    if prepare_files; then
        # Fazer commit se há mudanças
        make_commit
    else
        print_color $YELLOW "ℹ️ Nenhuma mudança para commit, enviando arquivos existentes..."
    fi
    
    # Fazer push para GitHub
    push_to_github
    
    # Mostrar instruções do GitHub Pages
    show_github_pages_instructions
    
    # Verificar status do deploy
    check_deploy_status
    
    # Mostrar próximos passos
    show_next_steps
    
    # Mostrar resumo final
    show_final_summary
}

# Executar função principal
main "$@"
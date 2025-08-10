#!/bin/bash

# Script para abrir navegador de forma robusta
URL=${1:-"http://localhost:8000/index.html"}

echo "🌐 Abrindo navegador para: $URL"

# Lista de navegadores para tentar (em ordem de preferência)
BROWSERS=(
    "google-chrome"
    "chromium-browser" 
    "chromium"
    "firefox"
    "firefox-esr"
    "opera"
    "brave-browser"
    "microsoft-edge"
    "x-www-browser"
    "xdg-open"
)

# Função para testar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Tentar cada navegador
for browser in "${BROWSERS[@]}"; do
    if command_exists "$browser"; then
        echo "✅ Tentando abrir com: $browser"
        
        case $browser in
            "google-chrome"|"chromium-browser"|"chromium"|"brave-browser"|"microsoft-edge")
                # Navegadores baseados em Chromium
                "$browser" --app="$URL" >/dev/null 2>&1 &
                ;;
            "firefox"|"firefox-esr")
                # Firefox
                "$browser" --new-window "$URL" >/dev/null 2>&1 &
                ;;
            "xdg-open")
                # Abrir com aplicativo padrão
                xdg-open "$URL" >/dev/null 2>&1 &
                ;;
            *)
                # Outros navegadores
                "$browser" "$URL" >/dev/null 2>&1 &
                ;;
        esac
        
        # Aguardar um pouco para ver se funcionou
        sleep 2
        
        # Verificar se o processo ainda está rodando
        if pgrep -f "$browser" >/dev/null; then
            echo "🎉 Navegador aberto com sucesso: $browser"
            exit 0
        fi
    fi
done

# Se chegou aqui, nenhum navegador funcionou
echo "❌ Nenhum navegador encontrado ou funcionando"
echo "📱 Por favor, abra manualmente: $URL"
echo ""
echo "💡 Navegadores suportados:"
echo "  - Google Chrome: sudo apt install google-chrome-stable"
echo "  - Chromium: sudo apt install chromium-browser"
echo "  - Firefox: sudo apt install firefox"
echo ""
echo "🔗 Ou acesse diretamente: $URL"

exit 1
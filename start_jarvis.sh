#!/bin/bash

# Script para iniciar o Jarvis com ambiente virtual
# Uso: ./start_jarvis.sh [opção]
# Opções: full, web, camera, test

echo "🤖 INICIANDO JARVIS"
echo "==================="

# Verificar se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "❌ Ambiente virtual não encontrado em venv/"
    echo "💡 Criando ambiente virtual..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Falha ao criar ambiente virtual"
        echo "💡 Instale python3-venv: sudo apt install python3-venv"
        exit 1
    fi
    echo "✅ Ambiente virtual criado!"
fi

# Ativar ambiente virtual
echo "🔄 Ativando ambiente virtual..."
source venv/bin/activate

# Verificar se ativou corretamente
if [ "$VIRTUAL_ENV" = "" ]; then
    echo "❌ Falha ao ativar ambiente virtual"
    exit 1
fi

echo "✅ Ambiente virtual ativo: $VIRTUAL_ENV"

# Verificar dependências básicas
echo "🔍 Verificando dependências..."
python -c "import cv2, eel, engine.camera_config" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ Algumas dependências podem estar faltando"
    echo "💡 Execute: pip install -r requirements.txt"
fi

# Determinar qual comando executar
OPTION=${1:-full}

case $OPTION in
    "full")
        echo "🚀 Iniciando Jarvis COMPLETO (Interface Web + Hotword + IP Camera)"
        echo "📱 Interface web: http://localhost:8000"
        echo "🎥 IP Camera: 192.168.15.7:8080"
        echo "🎤 Hotword: 'Jarvis' ou 'Alexa'"
        echo ""
        python run.py
        ;;
    "web")
        echo "🌐 Iniciando apenas Interface Web + IP Camera"
        echo "📱 Interface web: http://localhost:8000"
        echo "🎥 IP Camera: 192.168.15.7:8080"
        echo ""
        python main.py
        ;;
    "camera")
        echo "📹 Iniciando configuração de câmera"
        python camera_setup.py
        ;;
    "test")
        echo "🧪 Testando IP Camera"
        python -m engine.auth.recoganize test auto
        ;;
    *)
        echo "❌ Opção inválida: $OPTION"
        echo ""
        echo "📋 Opções disponíveis:"
        echo "  ./start_jarvis.sh full    - Jarvis completo (padrão)"
        echo "  ./start_jarvis.sh web     - Apenas interface web"
        echo "  ./start_jarvis.sh camera  - Configurar câmera"
        echo "  ./start_jarvis.sh test    - Testar IP camera"
        exit 1
        ;;
esac

echo ""
echo "👋 Jarvis finalizado!"
echo "🔄 Desativando ambiente virtual..."
deactivate
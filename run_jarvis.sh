#!/bin/bash

# Script simplificado para executar Jarvis
echo "🤖 JARVIS - EXECUÇÃO SIMPLIFICADA"
echo "=================================="

# Verificar se ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "❌ Ambiente virtual não encontrado!"
    echo "💡 Execute primeiro: python3 -m venv venv"
    exit 1
fi

# Ativar ambiente virtual
echo "🔄 Ativando ambiente virtual..."
source venv/bin/activate

# Verificar se ativou
if [ "$VIRTUAL_ENV" = "" ]; then
    echo "❌ Falha ao ativar ambiente virtual"
    exit 1
fi

echo "✅ Ambiente virtual ativo"

# Verificar dependências básicas
echo "🔍 Verificando dependências básicas..."
python -c "import cv2, eel, engine.camera_config" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ Instalando dependências básicas..."
    pip install python-dotenv eel opencv-python requests
fi

# Verificar dependências do Jarvis
echo "🔍 Verificando dependências do Jarvis..."
python -c "from playsound import playsound; import pyttsx3; import pyautogui" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️ Instalando dependências do Jarvis..."
    pip install playsound pyttsx3 pyautogui
fi

# Escolher modo de execução
MODE=${1:-web}

case $MODE in
    "full")
        echo "🚀 Executando Jarvis COMPLETO"
        echo "📱 Interface: http://localhost:8000"
        echo "🎥 IP Camera: 192.168.15.7:8080"
        echo "🎤 Hotword: 'Jarvis' ou 'Alexa'"
        echo ""
        python run.py
        ;;
    "web")
        echo "🌐 Executando Interface Web + IP Camera"
        echo "📱 Interface: http://localhost:8000"
        echo "🎥 IP Camera: 192.168.15.7:8080"
        echo ""
        # main.py define a função start(), então precisamos chamá-la explicitamente
        python -c "from main import start; start()"
        ;;
    "test")
        echo "🧪 Testando IP camera"
        python test_ip_camera.py
        ;;
    "list")
        echo "📹 Listando câmeras disponíveis"
        python -m engine.auth.recoganize list
        ;;
    "detect")
        echo "🔍 Detectando IP do celular"
        python detect_phone_ip.py
        ;;
    "config")
        echo "⚙️ Configurando câmera"
        python camera_setup.py
        ;;
    *)
        echo "❌ Modo inválido: $MODE"
        echo ""
        echo "📋 Modos disponíveis:"
        echo "  ./run_jarvis.sh web     - Interface web (padrão)"
        echo "  ./run_jarvis.sh full    - Jarvis completo"
        echo "  ./run_jarvis.sh test    - Testar IP camera"
        echo "  ./run_jarvis.sh list    - Listar câmeras"
        echo "  ./run_jarvis.sh detect  - Detectar IP do celular"
        echo "  ./run_jarvis.sh config  - Configurar câmera"
        exit 1
        ;;
esac

echo ""
echo "👋 Jarvis finalizado!"
deactivate
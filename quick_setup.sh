#!/bin/bash

# Setup rápido para testar o Jarvis
echo "⚡ SETUP RÁPIDO JARVIS"
echo "====================="

# Ativar ambiente virtual
echo "🔄 Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências básicas primeiro
echo "📦 Instalando dependências básicas..."
pip install python-dotenv eel opencv-python requests

# Testar imports básicos
echo "🧪 Testando imports básicos..."
python -c "
try:
    import cv2
    print('✅ OpenCV funcionando')
except:
    print('❌ OpenCV falhou')

try:
    import eel
    print('✅ Eel funcionando')
except:
    print('❌ Eel falhou')

try:
    from dotenv import load_dotenv
    print('✅ python-dotenv funcionando')
except:
    print('❌ python-dotenv falhou')

try:
    from engine.camera_config import camera_config
    print('✅ camera_config funcionando')
except Exception as e:
    print(f'❌ camera_config falhou: {e}')
"

echo ""
echo "🎯 Setup básico concluído!"
echo "💡 Para instalar todas as dependências: ./setup_environment.sh"
echo "🚀 Para testar: ./start_jarvis.sh test"
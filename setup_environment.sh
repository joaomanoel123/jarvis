#!/bin/bash

# Script para configurar o ambiente virtual do Jarvis
echo "🔧 CONFIGURANDO AMBIENTE JARVIS"
echo "================================"

# Verificar se python3-venv está instalado
echo "🔍 Verificando python3-venv..."
if ! dpkg -l | grep -q python3-venv; then
    echo "📦 Instalando python3-venv..."
    sudo apt update
    sudo apt install -y python3-venv python3-pip python3-dev
fi

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "🏗️ Criando ambiente virtual..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Falha ao criar ambiente virtual"
        exit 1
    fi
    echo "✅ Ambiente virtual criado!"
else
    echo "✅ Ambiente virtual já existe"
fi

# Ativar ambiente virtual
echo "🔄 Ativando ambiente virtual..."
source venv/bin/activate

# Verificar se ativou
if [ "$VIRTUAL_ENV" = "" ]; then
    echo "❌ Falha ao ativar ambiente virtual"
    exit 1
fi

echo "✅ Ambiente virtual ativo: $VIRTUAL_ENV"

# Atualizar pip
echo "⬆️ Atualizando pip..."
pip install --upgrade pip

# Instalar dependências
echo "📦 Instalando dependências do Jarvis..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo "✅ Dependências instaladas com sucesso!"
    else
        echo "⚠️ Algumas dependências podem ter falhado"
        echo "💡 Tente instalar manualmente as que falharam"
    fi
else
    echo "❌ Arquivo requirements.txt não encontrado"
    exit 1
fi

# Verificar instalações críticas
echo "🧪 Verificando instalações críticas..."
python -c "
import sys
modules = ['cv2', 'eel', 'pyttsx3', 'speech_recognition', 'requests', 'dotenv']
failed = []

for module in modules:
    try:
        __import__(module)
        print(f'✅ {module}')
    except ImportError:
        print(f'❌ {module}')
        failed.append(module)

if failed:
    print(f'\\n⚠️ Módulos com falha: {failed}')
    print('💡 Tente instalar manualmente:')
    for module in failed:
        if module == 'cv2':
            print('   pip install opencv-python')
        elif module == 'dotenv':
            print('   pip install python-dotenv')
        else:
            print(f'   pip install {module}')
else:
    print('\\n🎉 Todas as dependências críticas estão instaladas!')
"

echo ""
echo "🎯 CONFIGURAÇÃO CONCLUÍDA!"
echo "=========================="
echo "📋 Próximos passos:"
echo "1. Execute: ./start_jarvis.sh"
echo "2. Ou ative manualmente: source venv/bin/activate"
echo "3. Configure sua IP camera no arquivo .env se necessário"
echo ""
echo "🔄 Desativando ambiente virtual..."
deactivate
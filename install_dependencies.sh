#!/bin/bash

echo "🚀 Instalando dependências do sistema para Jarvis..."

# Atualizar repositórios
sudo apt update

# Instalar dependências do sistema
echo "📦 Instalando dependências do sistema..."
sudo apt install -y \
    python3-pip \
    python3-dev \
    python3-venv \
    portaudio19-dev \
    espeak \
    espeak-data \
    libespeak1 \
    libespeak-dev \
    festival \
    festvox-kallpc16k \
    alsa-utils \
    pulseaudio \
    cmake \
    build-essential \
    libgtk-3-dev \
    libboost-all-dev \
    libopencv-dev \
    python3-opencv \
    libasound2-dev \
    libportaudio2 \
    libportaudiocpp0 \
    ffmpeg \
    google-chrome-stable

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "🐍 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source venv/bin/activate

# Atualizar pip
echo "⬆️ Atualizando pip..."
pip install --upgrade pip

# Instalar dependências Python
echo "📚 Instalando dependências Python..."
pip install -r requirements.txt

echo "✅ Instalação concluída!"
echo ""
echo "Para executar o Jarvis:"
echo "1. Ative o ambiente virtual: source venv/bin/activate"
echo "2. Execute: python3 main.py"
echo ""
echo "⚠️ Lembre-se de configurar suas chaves de API no arquivo .env"
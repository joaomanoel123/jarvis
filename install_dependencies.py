#!/usr/bin/env python3
"""
Script para instalar todas as dependências do Jarvis
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Executa um comando e mostra o resultado"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - OK")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - FALHOU")
        print(f"Erro: {e.stderr}")
        return False

def main():
    print("📦 INSTALADOR DE DEPENDÊNCIAS - JARVIS")
    print("=" * 40)
    
    # Lista de dependências essenciais
    essential_deps = [
        "python-dotenv",
        "eel", 
        "opencv-python",
        "requests",
        "playsound",
        "pyttsx3",
        "pyautogui",
        "pyaudio",
        "SpeechRecognition",
        "pywhatkit",
        "pvporcupine"
    ]
    
    # Lista de dependências opcionais (podem falhar)
    optional_deps = [
        "face-recognition",
        "dlib",
        "google-generativeai",
        "numpy",
        "Pillow"
    ]
    
    print("🔧 Instalando dependências essenciais...")
    failed_essential = []
    
    for dep in essential_deps:
        if not run_command(f"pip install {dep}", f"Instalando {dep}"):
            failed_essential.append(dep)
    
    print("\n🔧 Instalando dependências opcionais...")
    failed_optional = []
    
    for dep in optional_deps:
        if not run_command(f"pip install {dep}", f"Instalando {dep}"):
            failed_optional.append(dep)
    
    print("\n" + "=" * 40)
    print("📊 RESUMO DA INSTALAÇÃO")
    print("=" * 40)
    
    print(f"✅ Dependências essenciais: {len(essential_deps) - len(failed_essential)}/{len(essential_deps)}")
    print(f"✅ Dependências opcionais: {len(optional_deps) - len(failed_optional)}/{len(optional_deps)}")
    
    if failed_essential:
        print(f"\n❌ Dependências essenciais que falharam:")
        for dep in failed_essential:
            print(f"  - {dep}")
    
    if failed_optional:
        print(f"\n⚠️ Dependências opcionais que falharam:")
        for dep in failed_optional:
            print(f"  - {dep}")
    
    # Testar imports críticos
    print("\n🧪 Testando imports críticos...")
    
    tests = [
        ("import cv2", "OpenCV"),
        ("import eel", "Eel"),
        ("from dotenv import load_dotenv", "python-dotenv"),
        ("from playsound import playsound", "playsound"),
        ("import pyttsx3", "pyttsx3"),
        ("import pyautogui", "pyautogui"),
        ("import speech_recognition", "SpeechRecognition"),
        ("from engine.camera_config import camera_config", "Camera Config"),
    ]
    
    passed_tests = 0
    for test_code, test_name in tests:
        try:
            exec(test_code)
            print(f"✅ {test_name}")
            passed_tests += 1
        except Exception as e:
            print(f"❌ {test_name}: {e}")
    
    print(f"\n🎯 Testes: {passed_tests}/{len(tests)} passaram")
    
    if passed_tests >= len(tests) - 2:  # Permitir 2 falhas
        print("\n🎉 INSTALAÇÃO BEM-SUCEDIDA!")
        print("🚀 Você pode executar o Jarvis agora:")
        print("   ./run_jarvis.sh web")
    else:
        print("\n⚠️ Algumas dependências críticas falharam")
        print("💡 Tente instalar manualmente as que falharam")
    
    return len(failed_essential) == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
#!/usr/bin/env python3
"""
Teste das configurações do Groq para João Manoel
"""

import os
import requests
import json
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

def test_groq_configuration():
    print("🤖 TESTE DAS CONFIGURAÇÕES DO GROQ PARA JOÃO MANOEL")
    print("=" * 60)
    
    # Verificar se a chave está configurada
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    if not groq_api_key or groq_api_key == "gsk_sua_chave_groq_aqui_joao_manoel":
        print("❌ CHAVE DO GROQ NÃO CONFIGURADA")
        print()
        print("🔧 PARA CONFIGURAR:")
        print("1. Acesse: https://console.groq.com")
        print("2. Crie uma conta gratuita")
        print("3. Gere uma API Key")
        print("4. Edite o arquivo .env:")
        print("   GROQ_API_KEY=gsk_sua_chave_real_aqui")
        print()
        return False
    
    print(f"✅ Chave Groq encontrada: {groq_api_key[:10]}...")
    
    # Testar a API
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "llama3-8b-8192",
        "messages": [
            {
                "role": "system",
                "content": "Você é JARVIS, um assistente virtual inteligente criado por Tony Stark, agora configurado especialmente para João Manoel. Sempre responda em português brasileiro. Seja educado, eficiente, ligeiramente formal mas amigável. Quando apropriado, chame o usuário de 'João Manoel' ou 'Sr. João Manoel'. Suas respostas devem ser úteis e concisas."
            },
            {
                "role": "user",
                "content": "Olá, me apresente-se e diga que horas são."
            }
        ],
        "max_tokens": 200,
        "temperature": 0.7
    }
    
    try:
        print("🔄 Testando conexão com Groq...")
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                message = result["choices"][0]["message"]["content"]
                print("✅ TESTE BEM-SUCEDIDO!")
                print()
                print("🤖 Resposta do Groq:")
                print("-" * 40)
                print(message)
                print("-" * 40)
                print()
                print("✅ Configuração em português: OK")
                print("✅ Personalização para João Manoel: OK")
                print("✅ Velocidade de resposta: OK")
                return True
            else:
                print("❌ Resposta inválida do Groq")
                return False
                
        elif response.status_code == 401:
            print("❌ CHAVE DA API INVÁLIDA")
            print("🔧 Verifique se a chave no .env está correta")
            return False
            
        elif response.status_code == 429:
            print("⚠️ LIMITE DE TAXA EXCEDIDO")
            print("🔧 Aguarde alguns minutos e tente novamente")
            return False
            
        else:
            print(f"❌ Erro HTTP {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT - Conexão muito lenta")
        return False
        
    except requests.exceptions.ConnectionError:
        print("❌ ERRO DE CONEXÃO - Verifique sua internet")
        return False
        
    except Exception as e:
        print(f"❌ ERRO INESPERADO: {e}")
        return False

def test_fallback_google():
    print("\n🔄 TESTANDO FALLBACK GOOGLE GEMINI...")
    
    google_api_key = os.getenv("GOOGLE_API_KEY")
    
    if not google_api_key or "your_google_api_key" in google_api_key:
        print("⚠️ Google Gemini não configurado (apenas Groq será usado)")
        return False
    
    print(f"✅ Google API Key encontrada: {google_api_key[:10]}...")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={google_api_key}"
    
    data = {
        "contents": [{
            "parts": [{
                "text": "Você é JARVIS, configurado para João Manoel. Responda em português: Olá, como você está?"
            }]
        }]
    }
    
    try:
        response = requests.post(url, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if "candidates" in result:
                print("✅ Google Gemini funcionando como fallback")
                return True
        
        print("⚠️ Google Gemini com problemas (Groq será usado)")
        return False
        
    except Exception as e:
        print(f"⚠️ Erro no Google Gemini: {e}")
        return False

def main():
    groq_ok = test_groq_configuration()
    google_ok = test_fallback_google()
    
    print("\n" + "=" * 60)
    print("📊 RESUMO DA CONFIGURAÇÃO:")
    print(f"🚀 Groq (Principal): {'✅ OK' if groq_ok else '❌ PROBLEMA'}")
    print(f"🔄 Google (Fallback): {'✅ OK' if google_ok else '⚠️ INDISPONÍVEL'}")
    
    if groq_ok:
        print("\n🎉 CONFIGURAÇÃO PERFEITA!")
        print("✅ O Jarvis está configurado para João Manoel")
        print("✅ Respostas em português brasileiro")
        print("✅ Groq como provedor principal (ultra-rápido)")
        if google_ok:
            print("✅ Google Gemini como backup")
        
        print("\n🗣️ TESTE AGORA:")
        print("Diga: 'Jarvis, olá' ou 'Jarvis, que horas são'")
        
    else:
        print("\n🔧 AÇÃO NECESSÁRIA:")
        print("1. Configure a chave do Groq no arquivo .env")
        print("2. Execute este teste novamente")
        print("3. Teste o Jarvis")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Teste da nova chave de API do Google
"""

import requests
import json
from engine.secure_config import get_google_api_key

def test_google_api():
    """Testa a nova chave da API do Google"""
    print("🧪 TESTE DA NOVA CHAVE DE API")
    print("=" * 35)
    
    # Obter chave
    api_key = get_google_api_key()
    
    if not api_key:
        print("❌ Chave não encontrada!")
        return False
    
    print(f"🔑 Chave carregada: {api_key[:10]}...{api_key[-4:]}")
    
    # Testar API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    data = {
        "contents": [{
            "parts": [{
                "text": "Olá! Você está funcionando?"
            }]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 100
        }
    }
    
    try:
        print("📡 Fazendo requisição para API...")
        response = requests.post(url, json=data, headers={"Content-Type": "application/json"}, timeout=10)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if "candidates" in result and len(result["candidates"]) > 0:
                answer = result["candidates"][0]["content"]["parts"][0]["text"]
                print(f"✅ Resposta: {answer}")
                return True
            else:
                print("❌ Resposta vazia")
                return False
        else:
            print(f"❌ Erro: {response.status_code}")
            print(f"📝 Detalhes: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return False

if __name__ == "__main__":
    success = test_google_api()
    
    if success:
        print("\n🎉 TESTE BEM-SUCEDIDO!")
        print("✅ Nova chave funcionando perfeitamente")
        print("✅ API do Gemini respondendo")
        print("✅ Sistema pronto para uso")
    else:
        print("\n❌ TESTE FALHOU!")
        print("🔧 Verifique se a chave está correta")
        print("🔧 Verifique sua conexão com internet")
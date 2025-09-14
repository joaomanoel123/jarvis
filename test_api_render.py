#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 Diagnóstico da API Render - JARVIS
Script para verificar o status da API no Render
"""

import requests
import json
import time
from datetime import datetime

# URL da sua API no Render
API_URL = "https://jarvis-tdgt.onrender.com"

def print_header(title):
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def print_section(title):
    print(f"\n📋 {title}")
    print("-" * 40)

def test_connectivity():
    """Testa conectividade básica"""
    print_section("TESTE DE CONECTIVIDADE")
    
    try:
        print(f"🌐 Testando conexão com: {API_URL}")
        
        # Teste básico de conectividade
        response = requests.get(API_URL, timeout=30)
        
        print(f"✅ Conectividade OK!")
        print(f"📡 Status Code: {response.status_code}")
        print(f"⏱️ Tempo de resposta: {response.elapsed.total_seconds():.2f}s")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"📝 Resposta JSON: {json.dumps(data, indent=2)}")
            except:
                print(f"📄 Resposta HTML: {response.text[:200]}...")
        
        return True
        
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT: A API não respondeu em 30 segundos")
        print("💡 Possíveis causas:")
        print("   • API está dormindo (cold start)")
        print("   • Problemas no Render")
        print("   • API não está rodando")
        return False
        
    except requests.exceptions.ConnectionError:
        print("❌ ERRO DE CONEXÃO: Não foi possível conectar")
        print("💡 Possíveis causas:")
        print("   • URL incorreta")
        print("   • API não está online")
        print("   • Problemas de DNS")
        return False
        
    except Exception as e:
        print(f"❌ ERRO INESPERADO: {e}")
        return False

def test_health_endpoint():
    """Testa o endpoint de health"""
    print_section("TESTE DO ENDPOINT /health")
    
    try:
        print(f"🔍 Testando: {API_URL}/health")
        
        response = requests.get(f"{API_URL}/health", timeout=30)
        
        print(f"📡 Status Code: {response.status_code}")
        print(f"⏱️ Tempo de resposta: {response.elapsed.total_seconds():.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check OK!")
            print(f"📊 Status da API:")
            
            for key, value in data.items():
                emoji = "✅" if value in [True, "ok", "production"] else "⚠️" if value else "❌"
                print(f"   {emoji} {key}: {value}")
            
            return data
        else:
            print(f"❌ Health check falhou: {response.status_code}")
            print(f"📄 Resposta: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro no health check: {e}")
        return None

def test_chat_endpoint():
    """Testa o endpoint de chat"""
    print_section("TESTE DO ENDPOINT /command")
    
    try:
        print(f"🔍 Testando: {API_URL}/command")
        
        payload = {
            "message": "Olá, você está funcionando?"
        }
        
        response = requests.post(
            f"{API_URL}/command",
            json=payload,
            timeout=60
        )
        
        print(f"📡 Status Code: {response.status_code}")
        print(f"⏱️ Tempo de resposta: {response.elapsed.total_seconds():.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Chat funcionando!")
            
            if "reply" in data:
                print(f"🤖 Resposta: {data['reply']}")
            else:
                print(f"📝 Dados: {json.dumps(data, indent=2)}")
            
            return True
        else:
            print(f"❌ Chat falhou: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📄 Erro: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📄 Resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro no chat: {e}")
        return False

def check_render_status():
    """Verifica status geral do Render"""
    print_section("VERIFICAÇÃO DO RENDER")
    
    print("🌐 Verificando status do Render.com...")
    
    try:
        # Verificar se o Render está funcionando
        response = requests.get("https://status.render.com/api/v2/status.json", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            status = data.get("status", {}).get("description", "unknown")
            print(f"✅ Status do Render: {status}")
        else:
            print("⚠️ Não foi possível verificar status do Render")
            
    except Exception as e:
        print(f"⚠️ Erro ao verificar Render: {e}")

def wake_up_api():
    """Tenta 'acordar' a API se estiver dormindo"""
    print_section("TENTANDO ACORDAR A API")
    
    print("😴 A API pode estar dormindo (cold start)")
    print("🔄 Fazendo múltiplas tentativas para acordar...")
    
    for i in range(3):
        try:
            print(f"   Tentativa {i+1}/3...")
            response = requests.get(API_URL, timeout=60)
            
            if response.status_code == 200:
                print(f"✅ API acordou na tentativa {i+1}!")
                return True
            else:
                print(f"   Status: {response.status_code}")
                
        except requests.exceptions.Timeout:
            print(f"   Timeout na tentativa {i+1}")
        except Exception as e:
            print(f"   Erro na tentativa {i+1}: {e}")
        
        if i < 2:  # Não esperar na última tentativa
            print("   ⏳ Aguardando 10 segundos...")
            time.sleep(10)
    
    print("❌ Não foi possível acordar a API")
    return False

def main():
    """Função principal"""
    print_header("DIAGNÓSTICO DA API RENDER - JARVIS")
    print(f"🕒 Iniciado em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 URL da API: {API_URL}")
    
    # 1. Verificar status do Render
    check_render_status()
    
    # 2. Teste de conectividade básica
    if not test_connectivity():
        # Se falhou, tentar acordar a API
        if wake_up_api():
            # Tentar novamente após acordar
            test_connectivity()
        else:
            print("\n❌ DIAGNÓSTICO FINAL: API não está acessível")
            print("\n🔧 SOLUÇÕES RECOMENDADAS:")
            print("1. Verifique se a API está rodando no Render Dashboard")
            print("2. Verifique os logs no Render para erros")
            print("3. Confirme se o deploy foi bem-sucedido")
            print("4. Verifique as variáveis de ambiente")
            print("5. Tente fazer redeploy manual")
            return
    
    # 3. Teste do health endpoint
    health_data = test_health_endpoint()
    
    # 4. Teste do chat endpoint
    chat_working = test_chat_endpoint()
    
    # 5. Resumo final
    print_header("RESUMO DO DIAGNÓSTICO")
    
    print("📊 RESULTADOS:")
    print(f"   🌐 Conectividade: ✅ OK")
    print(f"   ❤️ Health Check: {'✅ OK' if health_data else '❌ FALHOU'}")
    print(f"   💬 Chat: {'✅ OK' if chat_working else '❌ FALHOU'}")
    
    if health_data:
        print("\n🔧 CONFIGURAÇÕES:")
        api_configured = health_data.get("api_configured", False)
        api_provider = health_data.get("api_provider", "none")
        murf_configured = health_data.get("murf_tts_configured", False)
        
        print(f"   🤖 API IA: {'✅' if api_configured else '❌'} {api_provider}")
        print(f"   🎵 Murf TTS: {'✅' if murf_configured else '❌'}")
        
        if not api_configured:
            print("\n⚠️ ATENÇÃO: API de IA não configurada!")
            print("Configure GROQ_API_KEY ou GOOGLE_API_KEY no Render")
        
        if not murf_configured:
            print("\n⚠️ ATENÇÃO: Murf TTS não configurado!")
            print("Configure MURF_API_KEY no Render")
    
    if health_data and chat_working:
        print("\n🎉 DIAGNÓSTICO FINAL: API está funcionando perfeitamente!")
        print(f"🔗 Acesse: {API_URL}")
        print(f"📚 Documentação: {API_URL}/docs")
    else:
        print("\n⚠️ DIAGNÓSTICO FINAL: API tem problemas")
        print("Verifique os logs no Render Dashboard")

if __name__ == "__main__":
    main()
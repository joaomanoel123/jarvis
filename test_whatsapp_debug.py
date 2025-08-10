#!/usr/bin/env python3
"""
Script de diagnóstico para problemas do WhatsApp no Jarvis
Criado especialmente para João Manoel
"""

import os
import platform
import subprocess
import webbrowser
import time
from pathlib import Path

def print_header(title):
    print(f"\n{'='*50}")
    print(f"🔍 {title}")
    print(f"{'='*50}")

def test_system_info():
    print_header("INFORMAÇÕES DO SISTEMA")
    print(f"🖥️  Sistema Operacional: {platform.system()}")
    print(f"📋 Versão: {platform.version()}")
    print(f"🏗️  Arquitetura: {platform.architecture()}")
    print(f"💻 Máquina: {platform.machine()}")
    print(f"🌐 Nome do computador: {platform.node()}")

def test_whatsapp_desktop():
    print_header("TESTE: WhatsApp Desktop")
    
    system = platform.system()
    
    if system == "Windows":
        print("🔍 Testando WhatsApp no Windows...")
        
        # Testar diferentes caminhos do WhatsApp
        whatsapp_paths = [
            "WhatsApp",
            "C:\\Users\\%USERNAME%\\AppData\\Local\\WhatsApp\\WhatsApp.exe",
            "C:\\Program Files\\WhatsApp\\WhatsApp.exe",
            "C:\\Program Files (x86)\\WhatsApp\\WhatsApp.exe"
        ]
        
        for path in whatsapp_paths:
            try:
                print(f"  📂 Tentando: {path}")
                result = subprocess.run([path], capture_output=True, timeout=3)
                if result.returncode == 0:
                    print(f"  ✅ WhatsApp encontrado em: {path}")
                    return True
                else:
                    print(f"  ❌ Falhou com código: {result.returncode}")
            except FileNotFoundError:
                print(f"  ⚠️  Arquivo não encontrado: {path}")
            except subprocess.TimeoutExpired:
                print(f"  ✅ WhatsApp iniciado (timeout esperado): {path}")
                return True
            except Exception as e:
                print(f"  ❌ Erro: {e}")
    
    elif system == "Darwin":  # macOS
        print("🔍 Testando WhatsApp no macOS...")
        try:
            result = os.system('open -a "WhatsApp" 2>/dev/null')
            if result == 0:
                print("  ✅ WhatsApp encontrado no macOS")
                return True
            else:
                print("  ❌ WhatsApp não encontrado no macOS")
        except Exception as e:
            print(f"  ❌ Erro: {e}")
    
    else:  # Linux
        print("🔍 Testando WhatsApp no Linux...")
        whatsapp_commands = [
            "whatsapp-for-linux",
            "whatsdesk", 
            "whatsapp",
            "snap run whatsapp-for-linux",
            "flatpak run com.github.eneshecan.WhatsAppForLinux"
        ]
        
        for cmd in whatsapp_commands:
            try:
                print(f"  📂 Tentando: {cmd}")
                result = subprocess.run(cmd.split(), capture_output=True, timeout=2)
                print(f"  ✅ WhatsApp encontrado: {cmd}")
                return True
            except subprocess.TimeoutExpired:
                print(f"  ✅ WhatsApp iniciado (timeout esperado): {cmd}")
                return True
            except FileNotFoundError:
                print(f"  ⚠️  Comando não encontrado: {cmd}")
            except Exception as e:
                print(f"  ❌ Erro com {cmd}: {e}")
    
    print("  ❌ Nenhum WhatsApp Desktop encontrado")
    return False

def test_whatsapp_web():
    print_header("TESTE: WhatsApp Web")
    
    try:
        print("🌐 Testando abertura do WhatsApp Web...")
        
        # Testar navegador padrão
        print("  📂 Tentando navegador padrão...")
        webbrowser.open("https://web.whatsapp.com")
        print("  ✅ WhatsApp Web aberto com navegador padrão")
        time.sleep(2)
        return True
        
    except Exception as e:
        print(f"  ❌ Erro com navegador padrão: {e}")
        
        # Testar navegadores específicos
        browsers = [
            'google-chrome',
            'chromium-browser', 
            'firefox',
            'firefox-esr',
            'opera',
            'brave-browser'
        ]
        
        for browser in browsers:
            try:
                print(f"  📂 Tentando {browser}...")
                subprocess.run([browser, "https://web.whatsapp.com"], 
                             capture_output=True, timeout=3)
                print(f"  ✅ WhatsApp Web aberto com {browser}")
                return True
            except (FileNotFoundError, subprocess.TimeoutExpired):
                print(f"  ✅ {browser} iniciado (timeout esperado)")
                return True
            except Exception as e:
                print(f"  ⚠️  {browser} não funcionou: {e}")
        
        print("  ❌ Nenhum navegador funcionou")
        return False

def test_subprocess():
    print_header("TESTE: Funcionalidade subprocess")
    
    try:
        print("🔧 Testando subprocess básico...")
        
        system = platform.system()
        if system == "Windows":
            result = subprocess.run(["echo", "teste"], capture_output=True, text=True)
        else:
            result = subprocess.run(["echo", "teste"], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"  ✅ subprocess funcionando: {result.stdout.strip()}")
            return True
        else:
            print(f"  ❌ subprocess falhou: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"  ❌ Erro no subprocess: {e}")
        return False

def test_webbrowser():
    print_header("TESTE: Módulo webbrowser")
    
    try:
        print("🌐 Testando módulo webbrowser...")
        
        # Listar navegadores disponíveis
        print("  📋 Navegadores registrados:")
        for name in webbrowser._browsers:
            print(f"    - {name}")
        
        # Testar abertura de página simples
        print("  🔗 Testando abertura de página...")
        webbrowser.open("https://www.google.com")
        print("  ✅ webbrowser funcionando")
        return True
        
    except Exception as e:
        print(f"  ❌ Erro no webbrowser: {e}")
        return False

def test_jarvis_whatsapp():
    print_header("TESTE: Função openWhatsApp do Jarvis")
    
    try:
        print("🤖 Testando função do Jarvis...")
        
        # Importar e testar a função do Jarvis
        from engine.features import openWhatsApp
        
        print("  📞 Chamando openWhatsApp()...")
        openWhatsApp()
        print("  ✅ Função executada sem erros")
        return True
        
    except ImportError as e:
        print(f"  ❌ Erro de importação: {e}")
        return False
    except Exception as e:
        print(f"  ❌ Erro na execução: {e}")
        return False

def generate_solutions():
    print_header("SOLUÇÕES RECOMENDADAS PARA JOÃO MANOEL")
    
    system = platform.system()
    
    print("🔧 SOLUÇÕES POSSÍVEIS:")
    print()
    
    if system == "Windows":
        print("📱 WINDOWS - Opções para instalar WhatsApp:")
        print("  1. Microsoft Store:")
        print("     - Abra a Microsoft Store")
        print("     - Pesquise por 'WhatsApp'")
        print("     - Instale o WhatsApp oficial")
        print()
        print("  2. Site oficial:")
        print("     - Acesse: https://www.whatsapp.com/download")
        print("     - Baixe o WhatsApp para Windows")
        print()
        
    elif system == "Darwin":
        print("🍎 MACOS - Opções para instalar WhatsApp:")
        print("  1. Mac App Store:")
        print("     - Abra a App Store")
        print("     - Pesquise por 'WhatsApp'")
        print("     - Instale o WhatsApp oficial")
        print()
        
    else:
        print("🐧 LINUX - Opções para instalar WhatsApp:")
        print("  1. Snap Package:")
        print("     sudo snap install whatsapp-for-linux")
        print()
        print("  2. Flatpak:")
        print("     flatpak install flathub com.github.eneshecan.WhatsAppForLinux")
        print()
        print("  3. AppImage:")
        print("     - Baixe de: https://github.com/eneshecan/whatsapp-for-linux")
        print()
    
    print("🌐 ALTERNATIVA UNIVERSAL:")
    print("  - Use WhatsApp Web: https://web.whatsapp.com")
    print("  - Funciona em qualquer navegador")
    print("  - Não precisa instalar nada")
    print()
    
    print("🔧 VERIFICAÇÕES ADICIONAIS:")
    print("  1. Verifique se há um navegador instalado")
    print("  2. Teste manualmente: https://web.whatsapp.com")
    print("  3. Verifique permissões de execução")
    print("  4. Reinicie o Jarvis após instalar WhatsApp")

def main():
    print("🤖 DIAGNÓSTICO DO WHATSAPP - JARVIS")
    print("Configurado especialmente para João Manoel")
    print("=" * 60)
    
    # Executar todos os testes
    tests = [
        ("Informações do Sistema", test_system_info),
        ("subprocess", test_subprocess),
        ("webbrowser", test_webbrowser),
        ("WhatsApp Desktop", test_whatsapp_desktop),
        ("WhatsApp Web", test_whatsapp_web),
        ("Função Jarvis", test_jarvis_whatsapp)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            if test_name == "Informações do Sistema":
                test_func()  # Não retorna boolean
                results[test_name] = True
            else:
                results[test_name] = test_func()
        except Exception as e:
            print(f"❌ Erro no teste {test_name}: {e}")
            results[test_name] = False
    
    # Resumo dos resultados
    print_header("RESUMO DOS TESTES")
    for test_name, result in results.items():
        if test_name == "Informações do Sistema":
            continue
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"{status} - {test_name}")
    
    # Gerar soluções
    generate_solutions()
    
    print("\n" + "="*60)
    print("🎯 DIAGNÓSTICO CONCLUÍDO!")
    print("📧 Se o problema persistir, verifique as soluções acima.")
    print("="*60)

if __name__ == "__main__":
    main()
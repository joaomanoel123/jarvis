#!/usr/bin/env python3
"""
🔍 DIAGNÓSTICO COMPLETO DO JARVIS
Script para identificar problemas comuns no projeto Jarvis
"""

import os
import json
import subprocess
import sys
from pathlib import Path

def print_header(title):
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def print_section(title):
    print(f"\n📋 {title}")
    print("-" * 40)

def check_file_exists(file_path, description=""):
    """Verifica se um arquivo existe"""
    if os.path.exists(file_path):
        size = os.path.getsize(file_path)
        print(f"✅ {file_path} - {size} bytes {description}")
        return True
    else:
        print(f"❌ {file_path} - ARQUIVO FALTANDO {description}")
        return False

def check_directory_structure():
    """Verifica a estrutura de diretórios"""
    print_section("ESTRUTURA DE DIRETÓRIOS")
    
    required_dirs = [
        "docs/",
        "docs/assets/",
        "docs/js/",
        "docs/core/",
        "api/"
    ]
    
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            files_count = len(os.listdir(dir_path))
            print(f"✅ {dir_path} - {files_count} arquivos")
        else:
            print(f"❌ {dir_path} - DIRETÓRIO FALTANDO")

def check_essential_files():
    """Verifica arquivos essenciais"""
    print_section("ARQUIVOS ESSENCIAIS")
    
    essential_files = [
        ("docs/index.html", "Página principal"),
        ("docs/main-github-pages.js", "Script principal GitHub Pages"),
        ("docs/jarvis-tts.js", "Sistema TTS nativo"),
        ("docs/jarvis-murf-tts.js", "Sistema TTS Murf AI"),
        ("docs/jarvis-google-tts.js", "Sistema TTS Google"),
        ("docs/jarvis-speech-recognition.js", "Reconhecimento de voz"),
        ("docs/style.css", "Estilos CSS"),
        ("docs/manifest.json", "Manifest PWA"),
        ("api/main.py", "API Backend"),
        (".env", "Variáveis de ambiente")
    ]
    
    missing_files = []
    for file_path, description in essential_files:
        if not check_file_exists(file_path, f"({description})"):
            missing_files.append(file_path)
    
    return missing_files

def check_javascript_syntax():
    """Verifica sintaxe dos arquivos JavaScript"""
    print_section("VERIFICAÇÃO DE SINTAXE JAVASCRIPT")
    
    js_files = [
        "docs/main-github-pages.js",
        "docs/jarvis-tts.js",
        "docs/jarvis-murf-tts.js",
        "docs/jarvis-google-tts.js",
        "docs/jarvis-speech-recognition.js"
    ]
    
    for js_file in js_files:
        if os.path.exists(js_file):
            try:
                # Verificação básica de sintaxe
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Verificar se há caracteres de escape mal formados
                if '\\n' in content and content.count('\\n') > content.count('\\\\n'):
                    print(f"⚠️  {js_file} - Possíveis caracteres de escape mal formados")
                else:
                    print(f"✅ {js_file} - Sintaxe aparenta estar OK")
                    
            except Exception as e:
                print(f"❌ {js_file} - Erro ao ler: {e}")
        else:
            print(f"❌ {js_file} - Arquivo não encontrado")

def check_git_status():
    """Verifica status do Git"""
    print_section("STATUS DO GIT")
    
    try:
        # Verificar se é um repositório Git
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True, cwd='.')
        
        if result.returncode == 0:
            status_lines = result.stdout.strip().split('\n') if result.stdout.strip() else []
            
            if not status_lines or (len(status_lines) == 1 and not status_lines[0]):
                print("✅ Repositório Git limpo")
            else:
                print(f"⚠️  {len(status_lines)} arquivos não commitados:")
                for line in status_lines[:10]:  # Mostrar apenas os primeiros 10
                    print(f"   {line}")
                if len(status_lines) > 10:
                    print(f"   ... e mais {len(status_lines) - 10} arquivos")
        else:
            print("❌ Erro ao verificar status do Git")
            
    except FileNotFoundError:
        print("❌ Git não está instalado ou não disponível")
    except Exception as e:
        print(f"❌ Erro ao verificar Git: {e}")

def check_dependencies():
    """Verifica dependências Python"""
    print_section("DEPENDÊNCIAS PYTHON")
    
    if os.path.exists("requirements.txt"):
        print("✅ requirements.txt encontrado")
        try:
            with open("requirements.txt", 'r') as f:
                deps = f.read().strip().split('\n')
                print(f"📦 {len(deps)} dependências listadas")
                
            # Verificar se as principais dependências estão instaladas
            main_deps = ['fastapi', 'uvicorn', 'requests', 'pydantic']
            for dep in main_deps:
                try:
                    __import__(dep)
                    print(f"✅ {dep} - Instalado")
                except ImportError:
                    print(f"❌ {dep} - NÃO INSTALADO")
                    
        except Exception as e:
            print(f"❌ Erro ao verificar requirements.txt: {e}")
    else:
        print("❌ requirements.txt não encontrado")

def check_environment_variables():
    """Verifica variáveis de ambiente"""
    print_section("VARIÁVEIS DE AMBIENTE")
    
    if os.path.exists(".env"):
        print("✅ Arquivo .env encontrado")
        try:
            with open(".env", 'r') as f:
                lines = f.readlines()
                
            env_vars = {}
            for line in lines:
                if '=' in line and not line.strip().startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
            
            important_vars = [
                'GROQ_API_KEY',
                'GOOGLE_API_KEY', 
                'MURF_API_KEY'
            ]
            
            for var in important_vars:
                if var in env_vars:
                    value = env_vars[var]
                    if value and value != 'sua_chave_aqui':
                        print(f"✅ {var} - Configurado")
                    else:
                        print(f"⚠️  {var} - Vazio ou placeholder")
                else:
                    print(f"❌ {var} - Não encontrado")
                    
        except Exception as e:
            print(f"❌ Erro ao ler .env: {e}")
    else:
        print("❌ Arquivo .env não encontrado")

def check_github_pages_compatibility():
    """Verifica compatibilidade com GitHub Pages"""
    print_section("COMPATIBILIDADE GITHUB PAGES")
    
    # Verificar arquivo .nojekyll
    if os.path.exists("docs/.nojekyll"):
        print("✅ .nojekyll presente - Jekyll desabilitado")
    else:
        print("❌ .nojekyll ausente - Jekyll pode interferir")
    
    # Verificar index.html
    if os.path.exists("docs/index.html"):
        with open("docs/index.html", 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Verificar CSP
        if 'Content-Security-Policy' in content:
            print("✅ Content Security Policy configurado")
        else:
            print("⚠️  Content Security Policy não encontrado")
            
        # Verificar se há referências a localhost
        if 'localhost' in content:
            print("⚠️  Referências a localhost encontradas no HTML")
        else:
            print("✅ Sem referências a localhost no HTML")
    
    # Verificar manifest.json
    if os.path.exists("docs/manifest.json"):
        try:
            with open("docs/manifest.json", 'r') as f:
                manifest = json.load(f)
            print("✅ manifest.json válido")
        except json.JSONDecodeError:
            print("❌ manifest.json inválido")
    else:
        print("❌ manifest.json não encontrado")

def generate_troubleshooting_guide():
    """Gera guia de troubleshooting"""
    print_section("GUIA DE TROUBLESHOOTING")
    
    guide = """
🔧 PASSOS PARA RESOLVER PROBLEMAS COMUNS:

1. PROBLEMAS DE CARREGAMENTO:
   - Abra F12 (DevTools) no navegador
   - Vá para a aba Console
   - Procure por erros em vermelho
   - Verifique a aba Network para arquivos que falharam

2. PROBLEMAS DE ÁUDIO/VOZ:
   - Verifique se o navegador tem permissão de microfone
   - Teste em HTTPS (GitHub Pages)
   - Clique em qualquer lugar da página primeiro

3. PROBLEMAS DE API:
   - Verifique se as chaves API estão configuradas
   - Teste a conectividade: https://jarvis-tdgt.onrender.com/health
   - Verifique logs do console para erros de CORS

4. PROBLEMAS DE INTERFACE:
   - Limpe o cache do navegador (Ctrl+F5)
   - Teste em modo incógnito
   - Verifique se todos os arquivos CSS/JS carregaram

5. PROBLEMAS NO GITHUB PAGES:
   - Aguarde até 10 minutos após o commit
   - Verifique se o deploy foi bem-sucedido
   - Teste a URL: https://joaomanoel123.github.io/jarvis

6. COMANDOS ÚTEIS:
   - Para testar localmente: python -m http.server 8000
   - Para verificar sintaxe JS: node -c arquivo.js
   - Para limpar cache Git: git clean -fd
"""
    
    print(guide)

def main():
    """Função principal do diagnóstico"""
    print_header("DIAGNÓSTICO COMPLETO DO JARVIS")
    print("Este script irá verificar todos os componentes do seu projeto Jarvis")
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("docs") or not os.path.exists("api"):
        print("❌ ERRO: Execute este script no diretório raiz do projeto Jarvis")
        sys.exit(1)
    
    print("✅ Diretório do projeto Jarvis detectado")
    
    # Executar todas as verificações
    check_directory_structure()
    missing_files = check_essential_files()
    check_javascript_syntax()
    check_git_status()
    check_dependencies()
    check_environment_variables()
    check_github_pages_compatibility()
    
    # Resumo final
    print_header("RESUMO DO DIAGNÓSTICO")
    
    if missing_files:
        print(f"❌ {len(missing_files)} arquivos essenciais faltando:")
        for file in missing_files:
            print(f"   - {file}")
    else:
        print("✅ Todos os arquivos essenciais estão presentes")
    
    print("\n🔍 Para mais detalhes sobre problemas específicos:")
    print("   - Verifique os logs acima")
    print("   - Abra o console do navegador (F12)")
    print("   - Teste a URL: https://joaomanoel123.github.io/jarvis")
    
    generate_troubleshooting_guide()
    
    print_header("DIAGNÓSTICO CONCLUÍDO")
    print("📋 Salve este relatório e compartilhe se precisar de ajuda!")

if __name__ == "__main__":
    main()
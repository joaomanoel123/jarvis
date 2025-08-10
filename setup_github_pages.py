#!/usr/bin/env python3
"""
🚀 Script de Configuração para GitHub Pages - João Manoel
Versão Python para máxima compatibilidade
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, check=True):
    """Executa um comando e retorna o resultado"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=check)
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return False, e.stdout, e.stderr

def main():
    print("🤖 JARVIS - Setup GitHub Pages")
    print("=================================")
    print("Configurado especialmente para João Manoel")
    print("")

    # Verificar se estamos na pasta correta
    if not Path("main.py").exists():
        print("❌ Erro: Execute este script na pasta raiz do projeto Jarvis")
        sys.exit(1)

    print("📋 Verificando pré-requisitos...")

    # Verificar se git está instalado
    success, _, _ = run_command("git --version", check=False)
    if not success:
        print("❌ Git não está instalado. Instale o Git primeiro.")
        sys.exit(1)

    print("✅ Git encontrado")

    # Verificar se já é um repositório git
    if not Path(".git").exists():
        print("🔧 Inicializando repositório Git...")
        success, _, error = run_command("git init")
        if success:
            print("✅ Repositório Git inicializado")
        else:
            print(f"❌ Erro ao inicializar Git: {error}")
            sys.exit(1)
    else:
        print("✅ Repositório Git já existe")

    # Solicitar informações do usuário
    print("")
    print("📝 Configuração do GitHub:")
    github_user = input("Digite seu nome de usuário do GitHub: ").strip()
    repo_name = input("Digite o nome do repositório (padrão: jarvis): ").strip()
    
    if not repo_name:
        repo_name = "jarvis"

    if not github_user:
        print("❌ Nome de usuário é obrigatório!")
        sys.exit(1)

    print("")
    print("🔧 Configurando repositório remoto...")

    # Remover origin existente se houver
    run_command("git remote remove origin", check=False)

    # Adicionar novo origin
    repo_url = f"https://github.com/{github_user}/{repo_name}.git"
    success, _, error = run_command(f'git remote add origin "{repo_url}"')
    
    if success:
        print(f"✅ Repositório remoto configurado: {repo_url}")
    else:
        print(f"❌ Erro ao configurar repositório: {error}")
        sys.exit(1)

    # Verificar se há mudanças para commit
    success, output, _ = run_command("git status --porcelain")
    
    if output.strip():
        print("")
        print("📦 Preparando arquivos para commit...")
        
        # Adicionar todos os arquivos
        success, _, error = run_command("git add .")
        if not success:
            print(f"❌ Erro ao adicionar arquivos: {error}")
            sys.exit(1)
        
        # Fazer commit
        print("💾 Fazendo commit...")
        commit_message = """🚀 Deploy inicial do Jarvis para GitHub Pages

✨ Funcionalidades:
- Interface web moderna
- Integração com Groq API
- Suporte a português brasileiro
- Chat interativo
- Design futurista do Jarvis

🤖 Configurado especialmente para João Manoel"""
        
        success, _, error = run_command(f'git commit -m "{commit_message}"')
        if success:
            print("✅ Commit realizado")
        else:
            print(f"❌ Erro no commit: {error}")
            sys.exit(1)
    else:
        print("ℹ️ Nenhuma mudança para commit")

    print("")
    print("🚀 Enviando para GitHub...")

    # Tentar push
    success, _, error = run_command("git push -u origin main", check=False)
    
    if success:
        print("✅ Código enviado com sucesso!")
    else:
        print("⚠️ Primeira tentativa falhou, tentando forçar...")
        success, _, error2 = run_command("git push -u origin main --force-with-lease", check=False)
        
        if success:
            print("✅ Código enviado com sucesso (força)!")
        else:
            print("❌ Erro ao enviar código. Verifique:")
            print("   1. Se o repositório existe no GitHub")
            print("   2. Se você tem permissões de escrita")
            print("   3. Se suas credenciais estão corretas")
            print(f"   Erro: {error2}")
            sys.exit(1)

    print("")
    print("🌐 Configurando GitHub Pages...")
    print("📋 Passos manuais necessários:")
    print(f"   1. Acesse: https://github.com/{github_user}/{repo_name}")
    print("   2. Vá em Settings > Pages")
    print("   3. Em Source, selecione 'GitHub Actions'")
    print("   4. O deploy será automático!")
    print("")
    print("⏱️ Aguarde 2-5 minutos para o deploy")
    print(f"🔗 Seu Jarvis estará em: https://{github_user}.github.io/{repo_name}")
    print("")
    print("🎉 Configuração concluída!")
    print("")
    print("📚 Próximos passos:")
    print("   • Leia: DEPLOY_GITHUB_PAGES_JOAO_MANOEL.md")
    print("   • Configure API no Render (opcional)")
    print("   • Teste sua URL do GitHub Pages")
    print("")
    print("🤖 Jarvis configurado especialmente para João Manoel!")

if __name__ == "__main__":
    main()
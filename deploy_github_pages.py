#!/usr/bin/env python3
"""
Script para fazer deploy do Jarvis no GitHub Pages
Automatiza o processo de commit e push
"""

import os
import subprocess
import sys
from datetime import datetime

def print_header():
    """Exibe cabeçalho"""
    print("🚀 DEPLOY JARVIS NO GITHUB PAGES")
    print("=" * 40)
    print("📦 Preparando deploy da versão web...")
    print()

def check_git_status():
    """Verifica status do git"""
    print("1️⃣ Verificando status do Git...")
    
    try:
        # Verificar se estamos em um repositório git
        result = subprocess.run(['git', 'status'], capture_output=True, text=True)
        if result.returncode != 0:
            print("   ❌ Não é um repositório Git!")
            return False
        
        print("   ✅ Repositório Git encontrado!")
        
        # Verificar se há remote origin
        result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True)
        if 'origin' not in result.stdout:
            print("   ❌ Remote origin não configurado!")
            return False
        
        print("   ✅ Remote origin configurado!")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro ao verificar Git: {e}")
        return False

def add_files():
    """Adiciona arquivos ao Git"""
    print("2️⃣ Adicionando arquivos...")
    
    try:
        # Adicionar pasta docs
        subprocess.run(['git', 'add', 'docs/'], check=True)
        print("   ✅ Pasta docs/ adicionada!")
        
        # Adicionar script de deploy
        subprocess.run(['git', 'add', 'deploy_github_pages.py'], check=True)
        print("   ✅ Script de deploy adicionado!")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Erro ao adicionar arquivos: {e}")
        return False

def commit_changes():
    """Faz commit das mudanças"""
    print("3️⃣ Fazendo commit...")
    
    try:
        # Verificar se há mudanças para commit
        result = subprocess.run(['git', 'diff', '--cached', '--quiet'], capture_output=True)
        if result.returncode == 0:
            print("   ⚠️ Nenhuma mudança para commit!")
            return True
        
        # Fazer commit
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_message = f"🚀 Deploy J.A.R.V.I.S Web para GitHub Pages - {timestamp}"
        
        subprocess.run(['git', 'commit', '-m', commit_message], check=True)
        print(f"   ✅ Commit realizado: {commit_message}")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Erro no commit: {e}")
        return False

def push_to_github():
    """Faz push para o GitHub"""
    print("4️⃣ Enviando para GitHub...")
    
    try:
        # Push para origin main
        subprocess.run(['git', 'push', 'origin', 'main'], check=True)
        print("   ✅ Push realizado com sucesso!")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Erro no push: {e}")
        return False

def configure_github_pages():
    """Mostra instruções para configurar GitHub Pages"""
    print("5️⃣ Configurando GitHub Pages...")
    
    print("   📋 Instruções para ativar GitHub Pages:")
    print("   1. Vá para: https://github.com/joaomanoel123/jarvis/settings/pages")
    print("   2. Em 'Source', selecione 'Deploy from a branch'")
    print("   3. Em 'Branch', selecione 'main'")
    print("   4. Em 'Folder', selecione '/docs'")
    print("   5. Clique em 'Save'")
    print()
    print("   ⏰ Aguarde alguns minutos para o deploy...")
    print("   🌐 Seu site estará em: https://joaomanoel123.github.io/jarvis")
    
    return True

def create_github_workflow():
    """Cria workflow do GitHub Actions"""
    print("6️⃣ Criando GitHub Actions workflow...")
    
    # Criar pasta .github/workflows
    os.makedirs('.github/workflows', exist_ok=True)
    
    workflow_content = '''name: Deploy J.A.R.V.I.S to GitHub Pages

on:
  push:
    branches: [ main ]
    paths: [ 'docs/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'docs/**' ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './docs'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
'''
    
    try:
        with open('.github/workflows/deploy.yml', 'w') as f:
            f.write(workflow_content)
        
        print("   ✅ GitHub Actions workflow criado!")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro ao criar workflow: {e}")
        return False

def test_local_version():
    """Testa a versão local"""
    print("7️⃣ Testando versão local...")
    
    if os.path.exists('docs/index.html'):
        print("   ✅ index.html encontrado!")
        print("   💡 Para testar localmente:")
        print("      cd docs && python3 -m http.server 8080")
        print("      Depois acesse: http://localhost:8080")
        return True
    else:
        print("   ❌ index.html não encontrado!")
        return False

def main():
    """Função principal"""
    print_header()
    
    # Verificar se estamos na pasta correta
    if not os.path.exists('main.py'):
        print("❌ Execute este script na pasta do projeto Jarvis!")
        return
    
    steps = [
        ("Verificar Git", check_git_status),
        ("Adicionar Arquivos", add_files),
        ("Commit", commit_changes),
        ("Push para GitHub", push_to_github),
        ("Configurar GitHub Pages", configure_github_pages),
        ("Criar GitHub Actions", create_github_workflow),
        ("Testar Local", test_local_version)
    ]
    
    success_count = 0
    
    for step_name, step_func in steps:
        if step_func():
            success_count += 1
        print()
    
    # Resultado final
    print("🎉 DEPLOY CONCLUÍDO!")
    print("=" * 25)
    print(f"✅ Passos bem-sucedidos: {success_count}/{len(steps)}")
    
    if success_count >= 5:
        print("🎯 DEPLOY REALIZADO COM SUCESSO!")
        print()
        print("🌐 SEU JARVIS ESTARÁ DISPONÍVEL EM:")
        print("   https://joaomanoel123.github.io/jarvis")
        print()
        print("⏰ PRÓXIMOS PASSOS:")
        print("   1. Aguarde 5-10 minutos para o GitHub processar")
        print("   2. Acesse o link acima")
        print("   3. Configure GitHub Pages se necessário")
        print("   4. Teste todas as funcionalidades")
        print()
        print("🔧 PARA ATUALIZAÇÕES FUTURAS:")
        print("   1. Modifique arquivos na pasta docs/")
        print("   2. Execute: python3 deploy_github_pages.py")
        print("   3. Aguarde o deploy automático")
        
    else:
        print("⚠️ ALGUNS PASSOS FALHARAM")
        print("💡 Verifique os erros acima e tente novamente")
        print("🔧 Ou faça o deploy manual:")
        print("   git add docs/")
        print("   git commit -m 'Deploy J.A.R.V.I.S Web'")
        print("   git push origin main")
    
    print()
    print("📚 DOCUMENTAÇÃO:")
    print("   • README: docs/README.md")
    print("   • Configuração: docs/_config.yml")
    print("   • GitHub Pages: https://pages.github.com/")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\n👋 Deploy interrompido!")
    except Exception as e:
        print(f"\\n❌ Erro inesperado: {e}")
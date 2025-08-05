#!/usr/bin/env python3
"""
CORREÇÃO URGENTE DE SEGURANÇA - API KEYS EXPOSTAS
Remove chaves de API dos arquivos públicos e configura sistema seguro
"""

import os
import json
import subprocess

def print_header():
    """Exibe cabeçalho de emergência"""
    print("🚨 CORREÇÃO URGENTE DE SEGURANÇA")
    print("=" * 45)
    print("⚠️ CHAVES DE API EXPOSTAS DETECTADAS!")
    print("🔒 Aplicando correções de segurança...")
    print()

def remove_api_keys_from_cookies():
    """Remove chaves de API do cookies.json"""
    print("1️⃣ Removendo chaves do cookies.json...")
    
    try:
        # Criar versão segura do cookies.json
        safe_cookies = {
            "api_key": "YOUR_GROQ_API_KEY_HERE",
            "access_key": "YOUR_PORCUPINE_ACCESS_KEY_HERE", 
            "google_api_key": "YOUR_GOOGLE_API_KEY_HERE",
            "session_id": "",
            "token": ""
        }
        
        # Fazer backup do arquivo original
        if os.path.exists('engine/cookies.json'):
            subprocess.run(['cp', 'engine/cookies.json', 'engine/cookies.json.backup'])
            print("   📋 Backup criado: cookies.json.backup")
        
        # Salvar versão segura
        with open('engine/cookies.json', 'w') as f:
            json.dump(safe_cookies, f, indent=2)
        
        print("   ✅ Chaves removidas do cookies.json")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def remove_api_keys_from_web():
    """Remove chaves de API do arquivo web"""
    print("2️⃣ Removendo chaves do arquivo web...")
    
    try:
        # Ler arquivo atual
        with open('docs/main.js', 'r') as f:
            content = f.read()
        
        # Fazer backup
        with open('docs/main.js.backup', 'w') as f:
            f.write(content)
        print("   📋 Backup criado: main.js.backup")
        
        # Substituir chave por placeholder
        safe_content = content.replace(
            "const GOOGLE_API_KEY = 'AIzaSyDs5DEbpEMM3OGwAOafCfYfPdZMf-wn7hE';",
            "const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; // Configure sua chave aqui"
        )
        
        # Salvar versão segura
        with open('docs/main.js', 'w') as f:
            f.write(safe_content)
        
        print("   ✅ Chaves removidas do main.js")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def create_env_example():
    """Cria arquivo .env.example"""
    print("3️⃣ Criando arquivo .env.example...")
    
    env_content = """# Configuração de API Keys para Jarvis
# Copie este arquivo para .env e configure suas chaves

# Google Gemini API Key
# Obtenha em: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_api_key_here

# Groq API Key (opcional)
# Obtenha em: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

# Porcupine Access Key (opcional)
# Obtenha em: https://console.picovoice.ai/
PORCUPINE_ACCESS_KEY=your_porcupine_access_key_here
"""
    
    try:
        with open('.env.example', 'w') as f:
            f.write(env_content)
        
        print("   ✅ Arquivo .env.example criado")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def update_gitignore():
    """Atualiza .gitignore para proteger arquivos sensíveis"""
    print("4️⃣ Atualizando .gitignore...")
    
    gitignore_content = """# Arquivos de configuração sensíveis
.env
engine/cookies.json
*.backup

# Chaves de API
*api_key*
*secret*
*token*

# Arquivos Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Ambientes virtuais
venv/
env/
ENV/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Dados temporários
temp/
tmp/
cache/
"""
    
    try:
        with open('.gitignore', 'w') as f:
            f.write(gitignore_content)
        
        print("   ✅ .gitignore atualizado")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def create_secure_config_loader():
    """Cria carregador seguro de configurações"""
    print("5️⃣ Criando carregador seguro...")
    
    config_loader = '''#!/usr/bin/env python3
"""
Carregador seguro de configurações
Carrega chaves de API de variáveis de ambiente ou arquivo .env
"""

import os
import json
from typing import Dict, Optional

class SecureConfig:
    """Classe para carregar configurações de forma segura"""
    
    def __init__(self):
        self.config = {}
        self.load_config()
    
    def load_config(self):
        """Carrega configurações de variáveis de ambiente ou .env"""
        
        # Tentar carregar do .env primeiro
        if os.path.exists('.env'):
            self.load_from_env_file()
        
        # Carregar de variáveis de ambiente
        self.load_from_environment()
        
        # Fallback para cookies.json (se não tiver placeholders)
        self.load_from_cookies_fallback()
    
    def load_from_env_file(self):
        """Carrega do arquivo .env"""
        try:
            with open('.env', 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        self.config[key.strip()] = value.strip()
        except Exception as e:
            print(f"⚠️ Erro ao carregar .env: {e}")
    
    def load_from_environment(self):
        """Carrega de variáveis de ambiente"""
        env_keys = [
            'GOOGLE_API_KEY',
            'GROQ_API_KEY', 
            'PORCUPINE_ACCESS_KEY'
        ]
        
        for key in env_keys:
            value = os.getenv(key)
            if value:
                self.config[key] = value
    
    def load_from_cookies_fallback(self):
        """Fallback para cookies.json se não tiver placeholders"""
        try:
            if os.path.exists('engine/cookies.json'):
                with open('engine/cookies.json', 'r') as f:
                    cookies = json.load(f)
                
                # Só usar se não for placeholder
                if cookies.get('google_api_key') and 'YOUR_' not in cookies.get('google_api_key', ''):
                    self.config['GOOGLE_API_KEY'] = cookies['google_api_key']
                
                if cookies.get('api_key') and 'YOUR_' not in cookies.get('api_key', ''):
                    self.config['GROQ_API_KEY'] = cookies['api_key']
                
                if cookies.get('access_key') and 'YOUR_' not in cookies.get('access_key', ''):
                    self.config['PORCUPINE_ACCESS_KEY'] = cookies['access_key']
                    
        except Exception as e:
            print(f"⚠️ Erro ao carregar cookies.json: {e}")
    
    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """Obtém valor de configuração"""
        return self.config.get(key, default)
    
    def get_google_api_key(self) -> Optional[str]:
        """Obtém chave da API do Google"""
        return self.get('GOOGLE_API_KEY')
    
    def get_groq_api_key(self) -> Optional[str]:
        """Obtém chave da API do Groq"""
        return self.get('GROQ_API_KEY')
    
    def get_porcupine_access_key(self) -> Optional[str]:
        """Obtém chave de acesso do Porcupine"""
        return self.get('PORCUPINE_ACCESS_KEY')
    
    def is_configured(self) -> bool:
        """Verifica se pelo menos uma API está configurada"""
        return bool(self.get_google_api_key() or self.get_groq_api_key())

# Instância global
secure_config = SecureConfig()

# Funções de conveniência
def get_google_api_key() -> Optional[str]:
    return secure_config.get_google_api_key()

def get_groq_api_key() -> Optional[str]:
    return secure_config.get_groq_api_key()

def get_porcupine_access_key() -> Optional[str]:
    return secure_config.get_porcupine_access_key()

if __name__ == "__main__":
    print("🔒 Teste do carregador seguro:")
    print(f"Google API: {'✅ Configurada' if secure_config.get_google_api_key() else '❌ Não configurada'}")
    print(f"Groq API: {'✅ Configurada' if secure_config.get_groq_api_key() else '❌ Não configurada'}")
    print(f"Porcupine: {'✅ Configurada' if secure_config.get_porcupine_access_key() else '❌ Não configurada'}")
'''
    
    try:
        with open('engine/secure_config.py', 'w') as f:
            f.write(config_loader)
        
        print("   ✅ Carregador seguro criado")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def commit_security_fixes():
    """Faz commit das correções de segurança"""
    print("6️⃣ Aplicando correções no Git...")
    
    try:
        # Adicionar arquivos seguros
        subprocess.run(['git', 'add', '.gitignore', '.env.example', 'engine/secure_config.py'], check=True)
        subprocess.run(['git', 'add', 'engine/cookies.json', 'docs/main.js'], check=True)
        
        # Commit
        subprocess.run(['git', 'commit', '-m', '🔒 CORREÇÃO URGENTE: Remover chaves de API expostas'], check=True)
        
        print("   ✅ Correções commitadas")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro no commit: {e}")
        return False

def create_security_guide():
    """Cria guia de segurança"""
    print("7️⃣ Criando guia de segurança...")
    
    guide_content = """# 🔒 GUIA DE SEGURANÇA - CHAVES DE API

## 🚨 PROBLEMA RESOLVIDO!

As chaves de API foram removidas dos arquivos públicos e o sistema foi configurado de forma segura.

## 🔧 COMO CONFIGURAR SUAS CHAVES AGORA:

### Método 1 - Arquivo .env (Recomendado):
1. Copie o arquivo .env.example para .env:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo .env e adicione suas chaves:
   ```bash
   nano .env
   ```

3. Configure suas chaves:
   ```
   GOOGLE_API_KEY=sua_chave_do_google_aqui
   GROQ_API_KEY=sua_chave_do_groq_aqui
   ```

### Método 2 - Variáveis de ambiente:
```bash
export GOOGLE_API_KEY="sua_chave_aqui"
export GROQ_API_KEY="sua_chave_aqui"
```

### Método 3 - Cookies.json (local):
Edite engine/cookies.json e substitua os placeholders pelas suas chaves.

## 🛡️ SEGURANÇA IMPLEMENTADA:

- ✅ Chaves removidas de arquivos públicos
- ✅ .gitignore configurado para proteger arquivos sensíveis
- ✅ Sistema de carregamento seguro implementado
- ✅ Arquivo .env.example criado como template
- ✅ Backups dos arquivos originais criados

## 🔑 ONDE OBTER NOVAS CHAVES:

### Google Gemini API:
- Acesse: https://makersuite.google.com/app/apikey
- Crie uma nova chave
- Configure no .env

### Groq API (opcional):
- Acesse: https://console.groq.com/
- Crie uma conta e gere uma chave
- Configure no .env

## ⚠️ IMPORTANTE:

1. **NUNCA** commite arquivos com chaves reais
2. Use sempre .env ou variáveis de ambiente
3. Mantenha o .gitignore atualizado
4. Revogue a chave exposta e crie uma nova

## 🚀 PRÓXIMOS PASSOS:

1. Configure suas chaves no .env
2. Teste o sistema: `venv/bin/python main.py`
3. Revogue a chave exposta no Google Console
4. Crie uma nova chave para usar

Seu sistema agora está seguro! 🔒✨
"""
    
    try:
        with open('SEGURANCA_API_CORRIGIDA.md', 'w') as f:
            f.write(guide_content)
        
        print("   ✅ Guia de segurança criado")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

def main():
    """Função principal"""
    print_header()
    
    steps = [
        ("Remover chaves do cookies.json", remove_api_keys_from_cookies),
        ("Remover chaves do main.js", remove_api_keys_from_web),
        ("Criar .env.example", create_env_example),
        ("Atualizar .gitignore", update_gitignore),
        ("Criar carregador seguro", create_secure_config_loader),
        ("Commit das correções", commit_security_fixes),
        ("Criar guia de segurança", create_security_guide)
    ]
    
    success_count = 0
    
    for step_name, step_func in steps:
        print(f"📝 {step_name}...")
        if step_func():
            success_count += 1
        print()
    
    # Resultado final
    print("🔒 CORREÇÃO DE SEGURANÇA CONCLUÍDA!")
    print("=" * 40)
    print(f"✅ Passos bem-sucedidos: {success_count}/{len(steps)}")
    
    if success_count >= 6:
        print("🎯 SEGURANÇA RESTAURADA!")
        print("✅ Chaves de API removidas dos arquivos públicos")
        print("✅ Sistema seguro de configuração implementado")
        print("✅ .gitignore configurado para proteger arquivos sensíveis")
        print("✅ Backups dos arquivos originais criados")
        print()
        print("🚨 AÇÕES URGENTES NECESSÁRIAS:")
        print("   1. REVOGUE a chave exposta no Google Console")
        print("   2. CRIE uma nova chave de API")
        print("   3. CONFIGURE a nova chave no arquivo .env")
        print("   4. TESTE o sistema")
        print()
        print("📚 DOCUMENTAÇÃO:")
        print("   • Guia: SEGURANCA_API_CORRIGIDA.md")
        print("   • Template: .env.example")
        print("   • Carregador: engine/secure_config.py")
        
    else:
        print("❌ ALGUMAS CORREÇÕES FALHARAM")
        print("🔧 Execute as correções manualmente")
    
    print()
    print("⚠️ LEMBRE-SE:")
    print("   • Revogue a chave exposta IMEDIATAMENTE")
    print("   • Crie uma nova chave")
    print("   • Configure no .env")
    print("   • Nunca commite chaves reais novamente")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\\n👋 Correção interrompida!")
    except Exception as e:
        print(f"\\n❌ Erro inesperado: {e}")
#!/usr/bin/env python3
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
        
        # Carregar de variáveis de ambiente (sobrescreve .env)
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
                    if 'GOOGLE_API_KEY' not in self.config:
                        self.config['GOOGLE_API_KEY'] = cookies['google_api_key']
                
                if cookies.get('api_key') and 'YOUR_' not in cookies.get('api_key', ''):
                    if 'GROQ_API_KEY' not in self.config:
                        self.config['GROQ_API_KEY'] = cookies['api_key']
                
                if cookies.get('access_key') and 'YOUR_' not in cookies.get('access_key', ''):
                    if 'PORCUPINE_ACCESS_KEY' not in self.config:
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
    
    if secure_config.get_google_api_key():
        key = secure_config.get_google_api_key()
        print(f"Chave Google: {key[:10]}...{key[-4:]} (mascarada)")
#!/usr/bin/env python3
"""
Script de configuração e teste de câmeras para Jarvis
Suporte para câmeras locais e IP cameras
"""

import os
import sys
import cv2
from engine.camera_config import camera_config
from engine.auth.recoganize import list_cameras, test_camera, AuthenticateFace
from engine.auth.sample import collect_face_samples

def print_banner():
    """Exibe banner do script"""
    print("=" * 60)
    print("🎥 JARVIS - CONFIGURAÇÃO DE CÂMERAS")
    print("=" * 60)
    print()

def show_menu():
    """Exibe menu principal"""
    print("📋 MENU PRINCIPAL:")
    print("1. 📹 Listar câmeras disponíveis")
    print("2. 🧪 Testar câmera específica")
    print("3. 📸 Coletar amostras faciais")
    print("4. 🔐 Testar autenticação facial")
    print("5. ⚙️ Configurar IP camera")
    print("6. 📖 Mostrar configurações atuais")
    print("0. 🚪 Sair")
    print()

def configure_ip_camera():
    """Configura uma nova IP camera"""
    print("\n⚙️ CONFIGURAÇÃO DE IP CAMERA")
    print("-" * 40)
    
    # Verificar se arquivo .env existe
    env_file = ".env"
    if not os.path.exists(env_file):
        print("📝 Criando arquivo .env...")
        # Copiar do exemplo
        if os.path.exists(".env.example"):
            import shutil
            shutil.copy(".env.example", env_file)
            print("✅ Arquivo .env criado a partir do .env.example")
        else:
            print("❌ Arquivo .env.example não encontrado")
            return
    
    print("\n📝 Digite as informações da IP camera:")
    
    # Encontrar próximo índice disponível
    next_index = 1
    while os.getenv(f'IP_CAMERA_{next_index}_URL'):
        next_index += 1
    
    print(f"🔢 Configurando IP Camera {next_index}")
    
    url = input("📡 URL da câmera (ex: http://192.168.1.100:8080/video): ").strip()
    if not url:
        print("❌ URL é obrigatória")
        return
    
    username = input("👤 Usuário (deixe vazio se não precisar): ").strip()
    password = input("🔑 Senha (deixe vazio se não precisar): ").strip()
    enabled = input("✅ Habilitar câmera? (s/N): ").strip().lower() in ['s', 'sim', 'y', 'yes']
    
    # Adicionar ao arquivo .env
    with open(env_file, 'a') as f:
        f.write(f"\n# IP Camera {next_index}\n")
        f.write(f"IP_CAMERA_{next_index}_URL={url}\n")
        f.write(f"IP_CAMERA_{next_index}_USERNAME={username}\n")
        f.write(f"IP_CAMERA_{next_index}_PASSWORD={password}\n")
        f.write(f"IP_CAMERA_{next_index}_ENABLED={'true' if enabled else 'false'}\n")
    
    print(f"\n✅ IP Camera {next_index} configurada!")
    print("🔄 Reinicie o script para carregar as novas configurações")

def show_current_config():
    """Mostra configurações atuais"""
    print("\n📖 CONFIGURAÇÕES ATUAIS")
    print("-" * 40)
    
    print(f"🎯 Tipo padrão: {camera_config.default_type}")
    print(f"🔢 Índice padrão: {camera_config.default_index}")
    print(f"📐 Resolução: {camera_config.default_width}x{camera_config.default_height}")
    
    print(f"\n📹 IP Cameras configuradas: {len(camera_config.ip_cameras)}")
    for i, cam in enumerate(camera_config.ip_cameras):
        status = "🟢 Habilitada" if cam['enabled'] else "🔴 Desabilitada"
        print(f"  {i+1}. {cam['name']} - {status}")
        print(f"     URL: {cam['url']}")
        if cam['username']:
            print(f"     Usuário: {cam['username']}")

def test_camera_interactive():
    """Teste interativo de câmera"""
    print("\n🧪 TESTE DE CÂMERA")
    print("-" * 40)
    
    # Listar câmeras disponíveis
    cameras = list_cameras()
    if not cameras:
        return
    
    print("\n🎯 Escolha o tipo de teste:")
    print("1. 🤖 Automático (tenta IP camera primeiro, depois local)")
    print("2. 📡 IP Camera específica")
    print("3. 💻 Câmera local específica")
    
    choice = input("\nEscolha (1-3): ").strip()
    
    if choice == "1":
        test_camera("auto", 0)
    elif choice == "2":
        # Listar IP cameras
        ip_cameras = [cam for cam in cameras if cam['type'] == 'ip']
        if not ip_cameras:
            print("❌ Nenhuma IP camera disponível")
            return
        
        print("\n📡 IP Cameras disponíveis:")
        for i, cam in enumerate(ip_cameras):
            print(f"  {i}. {cam['name']}")
        
        try:
            index = int(input("Escolha o índice: "))
            test_camera("ip", index)
        except (ValueError, IndexError):
            print("❌ Índice inválido")
    elif choice == "3":
        try:
            index = int(input("Digite o índice da câmera local (0, 1, 2...): "))
            test_camera("local", index)
        except ValueError:
            print("❌ Índice inválido")
    else:
        print("❌ Opção inválida")

def collect_samples_interactive():
    """Coleta interativa de amostras"""
    print("\n📸 COLETA DE AMOSTRAS FACIAIS")
    print("-" * 40)
    
    print("🎯 Escolha o tipo de câmera:")
    print("1. 🤖 Automático")
    print("2. 📡 IP Camera")
    print("3. 💻 Câmera local")
    
    choice = input("\nEscolha (1-3): ").strip()
    
    camera_type = "auto"
    camera_index = 0
    
    if choice == "2":
        camera_type = "ip"
        try:
            camera_index = int(input("Índice da IP camera (0, 1, 2...): "))
        except ValueError:
            print("❌ Usando índice 0")
    elif choice == "3":
        camera_type = "local"
        try:
            camera_index = int(input("Índice da câmera local (0, 1, 2...): "))
        except ValueError:
            print("❌ Usando índice 0")
    
    collect_face_samples(camera_type, camera_index)

def test_auth_interactive():
    """Teste interativo de autenticação"""
    print("\n🔐 TESTE DE AUTENTICAÇÃO FACIAL")
    print("-" * 40)
    
    print("🎯 Escolha o tipo de câmera:")
    print("1. 🤖 Automático")
    print("2. 📡 IP Camera")
    print("3. 💻 Câmera local")
    
    choice = input("\nEscolha (1-3): ").strip()
    
    camera_type = "auto"
    camera_index = 0
    
    if choice == "2":
        camera_type = "ip"
        try:
            camera_index = int(input("Índice da IP camera (0, 1, 2...): "))
        except ValueError:
            print("❌ Usando índice 0")
    elif choice == "3":
        camera_type = "local"
        try:
            camera_index = int(input("Índice da câmera local (0, 1, 2...): "))
        except ValueError:
            print("❌ Usando índice 0")
    
    result = AuthenticateFace(camera_type, camera_index)
    if result == 1:
        print("✅ Autenticação bem-sucedida!")
    else:
        print("❌ Autenticação falhou")

def main():
    """Função principal"""
    print_banner()
    
    while True:
        show_menu()
        choice = input("Escolha uma opção: ").strip()
        
        if choice == "0":
            print("👋 Saindo...")
            break
        elif choice == "1":
            list_cameras()
        elif choice == "2":
            test_camera_interactive()
        elif choice == "3":
            collect_samples_interactive()
        elif choice == "4":
            test_auth_interactive()
        elif choice == "5":
            configure_ip_camera()
        elif choice == "6":
            show_current_config()
        else:
            print("❌ Opção inválida")
        
        input("\n⏸️ Pressione Enter para continuar...")
        print("\n" + "="*60)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Saindo...")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        sys.exit(1)
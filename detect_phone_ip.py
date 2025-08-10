#!/usr/bin/env python3
"""
Script para detectar automaticamente o IP do celular com IP Webcam
"""

import subprocess
import requests
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_network_range():
    """Detecta a faixa de rede atual"""
    try:
        # Obter gateway padrão
        result = subprocess.run(['ip', 'route', 'show', 'default'], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            # Extrair IP do gateway
            match = re.search(r'via (\d+\.\d+\.\d+\.\d+)', result.stdout)
            if match:
                gateway = match.group(1)
                # Assumir rede /24
                network = '.'.join(gateway.split('.')[:-1]) + '.0/24'
                return network, gateway
    except:
        pass
    
    # Fallback para rede comum
    return '192.168.15.0/24', '192.168.15.1'

def check_ip_webcam(ip, port=8080, timeout=2):
    """Verifica se um IP tem IP Webcam rodando"""
    try:
        url = f"http://{ip}:{port}"
        response = requests.get(url, timeout=timeout)
        
        if response.status_code == 200:
            # Verificar se é realmente IP Webcam
            content = response.text.lower()
            if 'ip webcam' in content or 'webcam' in content:
                return {
                    'ip': ip,
                    'port': port,
                    'url': url,
                    'title': 'IP Webcam detectado',
                    'server': response.headers.get('Server', 'Unknown')
                }
    except:
        pass
    
    return None

def scan_network_for_webcam():
    """Escaneia a rede procurando por IP Webcam"""
    network, gateway = get_network_range()
    print(f"🔍 Escaneando rede: {network}")
    print(f"📡 Gateway: {gateway}")
    
    # Gerar lista de IPs para testar
    base_ip = '.'.join(network.split('.')[:-1])
    ips_to_test = [f"{base_ip}.{i}" for i in range(1, 255)]
    
    print(f"🧪 Testando {len(ips_to_test)} IPs...")
    
    found_devices = []
    
    # Usar threads para acelerar o scan
    with ThreadPoolExecutor(max_workers=20) as executor:
        # Submeter todas as tarefas
        future_to_ip = {
            executor.submit(check_ip_webcam, ip): ip 
            for ip in ips_to_test
        }
        
        # Processar resultados conforme completam
        for future in as_completed(future_to_ip):
            result = future.result()
            if result:
                found_devices.append(result)
                print(f"✅ Encontrado: {result['ip']} - {result['title']}")
    
    return found_devices

def test_webcam_endpoints(ip, port=8080):
    """Testa endpoints específicos do IP Webcam"""
    endpoints = [
        '/video',
        '/videofeed', 
        '/shot.jpg',
        '/photo.jpg',
        '/mjpeg',
        '/stream'
    ]
    
    working_endpoints = []
    
    print(f"\n🧪 Testando endpoints em {ip}:{port}")
    
    for endpoint in endpoints:
        try:
            url = f"http://{ip}:{port}{endpoint}"
            response = requests.head(url, timeout=3)
            
            if response.status_code == 200:
                print(f"  ✅ {endpoint} - OK")
                working_endpoints.append(url)
            else:
                print(f"  ❌ {endpoint} - HTTP {response.status_code}")
                
        except requests.exceptions.Timeout:
            print(f"  ⏰ {endpoint} - Timeout")
        except Exception as e:
            print(f"  ❌ {endpoint} - {e}")
    
    return working_endpoints

def update_jarvis_config(ip, port=8080):
    """Atualiza a configuração do Jarvis com o novo IP"""
    try:
        # Ler arquivo .env atual
        with open('.env', 'r') as f:
            content = f.read()
        
        # Atualizar URLs
        new_content = re.sub(
            r'IP_CAMERA_1_URL=http://[\d.]+:8080/video',
            f'IP_CAMERA_1_URL=http://{ip}:{port}/video',
            content
        )
        new_content = re.sub(
            r'IP_CAMERA_1_URL_ALT1=http://[\d.]+:8080/videofeed',
            f'IP_CAMERA_1_URL_ALT1=http://{ip}:{port}/videofeed',
            new_content
        )
        new_content = re.sub(
            r'IP_CAMERA_1_URL_ALT2=http://[\d.]+:8080/shot.jpg',
            f'IP_CAMERA_1_URL_ALT2=http://{ip}:{port}/shot.jpg',
            new_content
        )
        
        # Salvar arquivo atualizado
        with open('.env', 'w') as f:
            f.write(new_content)
        
        print(f"✅ Arquivo .env atualizado com IP: {ip}")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao atualizar .env: {e}")
        return False

def main():
    print("📱 DETECTOR DE IP WEBCAM DO CELULAR")
    print("=" * 40)
    
    # Escanear rede
    devices = scan_network_for_webcam()
    
    if not devices:
        print("\n❌ Nenhum IP Webcam encontrado na rede!")
        print("\n💡 VERIFICAÇÕES:")
        print("1. O app IP Webcam está rodando no celular?")
        print("2. O celular está na mesma rede WiFi?")
        print("3. O servidor foi iniciado no app?")
        return
    
    print(f"\n✅ Encontrados {len(devices)} dispositivos:")
    
    for i, device in enumerate(devices):
        print(f"\n{i+1}. {device['ip']}:{device['port']}")
        print(f"   Título: {device['title']}")
        print(f"   Servidor: {device['server']}")
        
        # Testar endpoints
        endpoints = test_webcam_endpoints(device['ip'], device['port'])
        
        if endpoints:
            print(f"   ✅ {len(endpoints)} endpoints funcionando")
            
            # Se for o primeiro dispositivo encontrado, atualizar config
            if i == 0:
                print(f"\n🔄 Atualizando configuração do Jarvis...")
                if update_jarvis_config(device['ip'], device['port']):
                    print(f"✅ Configuração atualizada!")
                    print(f"\n🚀 Agora execute: ./run_jarvis.sh web")
        else:
            print(f"   ❌ Nenhum endpoint de vídeo funcionando")
    
    print("\n" + "=" * 40)
    print("📊 RESUMO")
    print("=" * 40)
    
    if devices:
        best_device = devices[0]
        print(f"🎯 Melhor opção: {best_device['ip']}:{best_device['port']}")
        print(f"🌐 URL principal: {best_device['url']}")
        print(f"\n💡 Para testar:")
        print(f"   1. Abra no navegador: {best_device['url']}")
        print(f"   2. Execute: python test_ip_camera.py")
        print(f"   3. Execute: ./run_jarvis.sh web")

if __name__ == "__main__":
    main()
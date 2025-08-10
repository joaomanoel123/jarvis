"""
Sistema de configuração de câmeras para Jarvis
Suporte aprimorado para IP webcam do celular
"""

import os
import cv2
from dotenv import load_dotenv
from urllib.parse import urlparse
from typing import List, Dict, Optional, Tuple

class CameraConfig:
    def __init__(self):
        # Forçar recarregar .env para garantir que mudanças recentes sejam aplicadas
        load_dotenv(override=True)
        
        # Configurações padrão
        self.default_type = os.getenv('CAMERA_DEFAULT_TYPE', 'auto')
        self.default_index = int(os.getenv('CAMERA_DEFAULT_INDEX', '0'))
        self.width = int(os.getenv('CAMERA_WIDTH', '640'))
        self.height = int(os.getenv('CAMERA_HEIGHT', '480'))
        self.timeout = int(os.getenv('CAMERA_TIMEOUT', '10'))
        self.retry_urls = os.getenv('CAMERA_RETRY_URLS', 'true').lower() == 'true'
        
        # Backends de câmera preferidos
        self.camera_backends = [
            getattr(cv2, 'CAP_V4L2', cv2.CAP_ANY),   # Linux
            getattr(cv2, 'CAP_DSHOW', cv2.CAP_ANY),  # Windows
            getattr(cv2, 'CAP_AVFOUNDATION', cv2.CAP_ANY),  # macOS
            cv2.CAP_ANY,
            0
        ]
        
        # Carregar IP cameras
        self.ip_cameras = self._load_ip_cameras()
        
        print(f"📱 Camera config carregada: {len(self.ip_cameras)} IP cameras")
        print(f"🔄 Retry URLs: {self.retry_urls}, Timeout: {self.timeout}s")

    def _load_ip_cameras(self):
        cameras = []
        
        # Carregar até 10 câmeras IP
        for i in range(1, 11):
            url = os.getenv(f'IP_CAMERA_{i}_URL')
            enabled = os.getenv(f'IP_CAMERA_{i}_ENABLED', 'false').lower() == 'true'
            
            if url and enabled:
                # URLs alternativas para IP webcam do celular
                alt_urls = []
                for alt_num in ['ALT1', 'ALT2', 'ALT3']:
                    alt_url = os.getenv(f'IP_CAMERA_{i}_URL_{alt_num}')
                    if alt_url:
                        alt_urls.append(alt_url)
                # Se endpoint HTTPS estiver acessível, usar URLs https como alternativa
                https_base = os.getenv(f'IP_CAMERA_{i}_HTTPS_BASE')
                if https_base:
                    for ep in ['/video','/videofeed','/shot.jpg']:
                        alt_urls.append(f'{https_base}{ep}')
                
                camera = {
                    'id': i,
                    'url': url,
                    'alt_urls': alt_urls,
                    'username': os.getenv(f'IP_CAMERA_{i}_USERNAME', ''),
                    'password': os.getenv(f'IP_CAMERA_{i}_PASSWORD', ''),
                    'enabled': enabled,
                    'type': os.getenv(f'IP_CAMERA_{i}_TYPE', 'mjpeg'),
                    'name': f'IP Camera {i}'
                }
                cameras.append(camera)
                print(f"📱 IP Camera {i} carregada: {url}")
                if alt_urls:
                    print(f"  🔄 URLs alternativas: {alt_urls}")
        
        return cameras

    def get_camera_source(self, camera_type='auto', camera_index=0):
        """
        Retorna a fonte da câmera baseada no tipo especificado
        
        Args:
            camera_type: 'auto', 'ip', 'local'
            camera_index: índice da câmera (para local) ou ID (para IP)
        
        Returns:
            tuple: (source, camera_info)
        """
        if camera_type == 'ip' or (camera_type == 'auto' and self.ip_cameras):
            # Usar primeira IP camera disponível
            if self.ip_cameras:
                camera = self.ip_cameras[0]
                # Retornar URL principal e informações completas
                return camera['url'], camera
            elif camera_type == 'ip':
                raise ValueError("Nenhuma IP camera configurada")
        
        if camera_type == 'local' or camera_type == 'auto':
            # Usar câmera local
            return camera_index, {'type': 'local', 'index': camera_index}
        
        raise ValueError(f"Tipo de câmera inválido: {camera_type}")

    def create_camera_capture(self, camera_type: str = 'auto', camera_index: int = 0) -> Optional[cv2.VideoCapture]:
        """Cria e retorna um objeto de captura de câmera conforme configuração."""
        cap = None
        try:
            # Tentar IP camera primeiro se aplicável
            if camera_type == 'ip' or (camera_type == 'auto' and self.ip_cameras):
                url = self.get_working_camera_url(camera_id=self.ip_cameras[0]['id']) if self.ip_cameras else None
                if not url and self.ip_cameras:
                    # Sem teste, usar URL principal mesmo assim
                    url = self.ip_cameras[0]['url']
                if url:
                    print(f"🎥 Conectando à IP camera: {url}")
                    cap = cv2.VideoCapture(url)
                    if cap.isOpened():
                        print("✅ IP camera conectada com sucesso!")
                        return self._configure_camera(cap)
                    else:
                        print("❌ Falha ao conectar IP camera, tentando câmera local...")
                        try:
                            cap.release()
                        except:
                            pass
            
            # Tentar câmera local
            local_index = camera_index if camera_type in ['local', 'auto'] else self.default_index
            print(f"🎥 Conectando à câmera local {local_index}")
            for backend in self.camera_backends:
                try:
                    cap = cv2.VideoCapture(local_index, backend)
                    if cap.isOpened():
                        print(f"✅ Câmera local {local_index} conectada (backend: {backend})")
                        return self._configure_camera(cap)
                    cap.release()
                except Exception as e:
                    continue
        except Exception as e:
            print(f"❌ Erro ao criar captura de câmera: {e}")
            if cap:
                try:
                    cap.release()
                except:
                    pass
        return None

    def _configure_camera(self, cap: cv2.VideoCapture) -> cv2.VideoCapture:
        """Configura parâmetros da câmera como resolução e FPS."""
        try:
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            cap.set(cv2.CAP_PROP_FPS, 30)
        except Exception as e:
            print(f"⚠️ Não foi possível configurar parâmetros da câmera: {e}")
        return cap
    
    def get_all_camera_urls(self, camera_id=1):
        """
        Retorna todas as URLs (principal + alternativas) para uma câmera IP
        
        Args:
            camera_id: ID da câmera IP
        
        Returns:
            list: Lista de URLs para tentar
        """
        for camera in self.ip_cameras:
            if camera['id'] == camera_id:
                urls = [camera['url']]
                if self.retry_urls and camera.get('alt_urls'):
                    urls.extend(camera['alt_urls'])
                return urls
        return []

    def test_ip_camera(self, camera_id=1):
        """
        Testa conectividade com uma IP camera (tenta todas as URLs)
        
        Args:
            camera_id: ID da câmera para testar
        
        Returns:
            dict: Resultado do teste
        """
        import requests
        
        camera = None
        for cam in self.ip_cameras:
            if cam['id'] == camera_id:
                camera = cam
                break
        
        if not camera:
            return {'success': False, 'error': f'Camera {camera_id} não encontrada'}
        
        # Obter todas as URLs para testar
        urls_to_test = self.get_all_camera_urls(camera_id)
        
        last_error = None
        for i, url in enumerate(urls_to_test):
            try:
                print(f"🧪 Testando URL {i+1}/{len(urls_to_test)}: {url}")
                
                # Testar conectividade HTTP primeiro
                # Configurar verificação SSL condicional para HTTPS (câmeras costumam usar certificado self-signed)
                verify = True
                parsed = urlparse(url)
                if parsed.scheme == 'https':
                    verify = False
                    try:
                        import urllib3
                        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
                    except Exception:
                        pass
                response = requests.get(url, timeout=self.timeout, stream=True, verify=verify)
                if response.status_code == 200:
                    print(f"  ✅ HTTP OK ({response.status_code})")
                    
                    # Testar abertura com OpenCV
                    # Para HTTPS, o OpenCV geralmente não abre streams; considerar sucesso após HTTP OK
                    if parsed.scheme == 'https':
                        print("  ⚠️ Stream HTTPS detectado – pulando teste do OpenCV")
                        return {
                            'success': True,
                            'camera': camera,
                            'working_url': url,
                            'frame_shape': None,
                            'url_index': i,
                            'note': 'HTTPS OK (OpenCV skip)'
                        }
                    else:
                        cap = cv2.VideoCapture(url)
                        if cap.isOpened():
                            print(f"  ✅ OpenCV conseguiu abrir")
                            ret, frame = cap.read()
                            cap.release()
                            if ret:
                                print(f"  ✅ Frame capturado: {frame.shape}")
                                return {
                                    'success': True, 
                                    'camera': camera,
                                    'working_url': url,
                                    'frame_shape': frame.shape,
                                    'url_index': i
                                }
                            else:
                                print(f"  ❌ Não conseguiu ler frame")
                                last_error = 'Não foi possível ler frame'
                        else:
                            print(f"  ❌ OpenCV não conseguiu abrir")
                            last_error = 'OpenCV não conseguiu abrir stream'
                else:
                    print(f"  ❌ HTTP falhou: {response.status_code}")
                    last_error = f'HTTP {response.status_code}'
            
            except Exception as e:
                print(f"  ❌ Erro: {e}")
                last_error = str(e)
                continue
        
        return {'success': False, 'error': f'Todas as URLs falharam. Último erro: {last_error}'}

    def list_available_cameras(self):
        """
        Lista todas as câmeras disponíveis (locais + IP)
        
        Returns:
            list: Lista de câmeras disponíveis
        """
        cameras = []
        
        # Detectar câmeras locais
        print("🔍 Detectando câmeras locais...")
        for i in range(5):  # Testar índices 0-4
            try:
                cap = cv2.VideoCapture(i)
                if cap.isOpened():
                    ret, frame = cap.read()
                    if ret:
                        cameras.append({
                            'type': 'local',
                            'index': i,
                            'name': f'Câmera Local {i}',
                            'available': True
                        })
                        print(f"  ✅ Câmera local {i}: OK")
                cap.release()
            except:
                pass
        
        # Adicionar IP cameras
        for camera in self.ip_cameras:
            camera_info = {
                'type': 'ip',
                'id': camera['id'],
                'name': camera['name'],
                'url': camera['url'],
                'available': True  # Assumir disponível, teste separado
            }
            
            # Adicionar URLs alternativas se disponíveis
            if camera.get('alt_urls'):
                camera_info['alt_urls'] = camera['alt_urls']
                camera_info['total_urls'] = len(camera['alt_urls']) + 1
            
            cameras.append(camera_info)
        
        return cameras

    def get_working_camera_url(self, camera_id=1):
        """
        Testa e retorna a primeira URL funcionando para uma câmera IP
        
        Args:
            camera_id: ID da câmera
        
        Returns:
            str or None: URL funcionando ou None se nenhuma funcionar
        """
        result = self.test_ip_camera(camera_id)
        if result['success']:
            return result['working_url']
        return None

    def update_camera_url(self, camera_id=1, new_url=None):
        """
        Atualiza a URL principal de uma câmera IP se uma URL alternativa funcionar melhor
        
        Args:
            camera_id: ID da câmera
            new_url: Nova URL (se None, testa automaticamente)
        
        Returns:
            bool: True se atualizou com sucesso
        """
        if new_url is None:
            # Testar automaticamente e usar a primeira que funcionar
            result = self.test_ip_camera(camera_id)
            if result['success'] and result['url_index'] > 0:
                new_url = result['working_url']
            else:
                return False
        
        # Atualizar a URL principal
        for camera in self.ip_cameras:
            if camera['id'] == camera_id:
                old_url = camera['url']
                camera['url'] = new_url
                print(f"📱 Camera {camera_id} URL atualizada: {old_url} -> {new_url}")
                return True
        
        return False

# Instância global
camera_config = CameraConfig()

def get_best_camera_url(camera_id=1):
    """
    Testa e retorna a melhor URL funcionando para uma câmera IP
    
    Args:
        camera_id: ID da câmera
    
    Returns:
        str or None: URL funcionando ou None se nenhuma funcionar
    """
    return camera_config.get_working_camera_url(camera_id)

def test_all_cameras():
    """
    Testa todas as câmeras configuradas
    
    Returns:
        dict: Resultados dos testes
    """
    results = {
        'local_cameras': [],
        'ip_cameras': []
    }
    
    # Testar câmeras locais
    for i in range(5):
        try:
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                ret, frame = cap.read()
                results['local_cameras'].append({
                    'index': i,
                    'working': ret,
                    'shape': frame.shape if ret else None
                })
            cap.release()
        except:
            pass
    
    # Testar IP cameras
    for camera in camera_config.ip_cameras:
        result = camera_config.test_ip_camera(camera['id'])
        results['ip_cameras'].append({
            'id': camera['id'],
            'name': camera['name'],
            'result': result
        })
    
    return results

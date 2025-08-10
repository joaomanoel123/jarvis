# Configuração de Câmeras para Jarvis
# Suporte para câmeras locais e IP cameras

import cv2
import os
from typing import Optional, List, Dict

# Tentar carregar dotenv (opcional)
try:
    from dotenv import load_dotenv
    load_dotenv()
    DOTENV_AVAILABLE = True
except ImportError:
    DOTENV_AVAILABLE = False
    print("⚠️ python-dotenv não disponível. Configure manualmente as variáveis de ambiente.")

class CameraConfig:
    """Configuração e gerenciamento de câmeras"""
    
    def __init__(self):
        # Configurações padrão (podem ser sobrescritas pelo .env)
        try:
            self.default_width = int(os.getenv('CAMERA_WIDTH', '640'))
            self.default_height = int(os.getenv('CAMERA_HEIGHT', '480'))
            self.default_type = os.getenv('CAMERA_DEFAULT_TYPE', 'auto')
            self.default_index = int(os.getenv('CAMERA_DEFAULT_INDEX', '0'))
        except (ValueError, TypeError):
            # Fallback para valores padrão se .env tiver valores inválidos
            self.default_width = 640
            self.default_height = 480
            self.default_type = 'auto'
            self.default_index = 0
        
        # Carregar IP cameras do .env
        self.ip_cameras = self._load_ip_cameras_from_env()
        
        # Backends de câmera para tentar (em ordem de prioridade)
        self.camera_backends = [
            cv2.CAP_V4L2,    # Linux
            cv2.CAP_DSHOW,   # Windows
            cv2.CAP_AVFOUNDATION,  # macOS
            cv2.CAP_ANY,     # Genérico
            0                # Padrão
        ]
    
    def _load_ip_cameras_from_env(self) -> List[Dict]:
        """Carrega configurações de IP cameras do arquivo .env"""
        cameras = []
        
        # Tentar carregar até 5 IP cameras
        for i in range(1, 6):
            url = os.getenv(f'IP_CAMERA_{i}_URL')
            if url:
                enabled = os.getenv(f'IP_CAMERA_{i}_ENABLED', 'false').lower() == 'true'
                camera = {
                    "name": f"IP Camera {i}",
                    "url": url,
                    "username": os.getenv(f'IP_CAMERA_{i}_USERNAME', ''),
                    "password": os.getenv(f'IP_CAMERA_{i}_PASSWORD', ''),
                    "enabled": enabled
                }
                cameras.append(camera)
        
        # Se nenhuma IP camera foi configurada no .env, usar exemplos padrão
        if not cameras:
            cameras = [
                {
                    "name": "IP Camera Principal (Exemplo)",
                    "url": "http://192.168.1.100:8080/video",  # Exemplo - substitua pelo seu IP
                    "username": "",  # Se necessário
                    "password": "",  # Se necessário
                    "enabled": False  # Desabilitado por padrão
                },
                {
                    "name": "IP Camera Secundária (Exemplo)", 
                    "url": "rtsp://192.168.1.101:554/stream",  # Exemplo RTSP
                    "username": "admin",
                    "password": "password",
                    "enabled": False  # Desabilitado por padrão
                }
            ]
        
        return cameras
    
    def get_ip_camera_url(self, camera_index: int = 0) -> Optional[str]:
        """Retorna URL da IP camera configurada"""
        if 0 <= camera_index < len(self.ip_cameras):
            camera = self.ip_cameras[camera_index]
            if camera["enabled"]:
                url = camera["url"]
                
                # Adicionar autenticação se necessário
                if camera["username"] and camera["password"]:
                    # Para URLs HTTP
                    if url.startswith("http://"):
                        url = url.replace("http://", f"http://{camera['username']}:{camera['password']}@")
                    # Para URLs RTSP
                    elif url.startswith("rtsp://"):
                        url = url.replace("rtsp://", f"rtsp://{camera['username']}:{camera['password']}@")
                
                return url
        return None
    
    def list_available_cameras(self) -> List[Dict]:
        """Lista todas as câmeras disponíveis"""
        cameras = []
        
        # Adicionar câmeras locais
        for i in range(5):  # Testar até 5 câmeras locais
            cap = None
            try:
                for backend in self.camera_backends:
                    cap = cv2.VideoCapture(i, backend)
                    if cap.isOpened():
                        cameras.append({
                            "type": "local",
                            "index": i,
                            "name": f"Câmera Local {i}",
                            "backend": backend
                        })
                        break
                    cap.release()
            except:
                pass
            finally:
                if cap:
                    cap.release()
        
        # Adicionar IP cameras configuradas
        for i, ip_cam in enumerate(self.ip_cameras):
            if ip_cam["enabled"]:
                cameras.append({
                    "type": "ip",
                    "index": i,
                    "name": ip_cam["name"],
                    "url": ip_cam["url"]
                })
        
        return cameras
    
    def create_camera_capture(self, camera_type: str = "auto", camera_index: int = 0) -> Optional[cv2.VideoCapture]:
        """Cria objeto de captura de câmera"""
        cap = None
        
        try:
            if camera_type == "ip":
                # Usar IP camera
                url = self.get_ip_camera_url(camera_index)
                if url:
                    print(f"🎥 Conectando à IP camera: {url}")
                    cap = cv2.VideoCapture(url)
                    if cap.isOpened():
                        print("✅ IP camera conectada com sucesso!")
                        return self._configure_camera(cap)
                    else:
                        print("❌ Falha ao conectar IP camera")
                        cap.release()
            
            elif camera_type == "local":
                # Usar câmera local
                print(f"🎥 Conectando à câmera local {camera_index}")
                for backend in self.camera_backends:
                    try:
                        cap = cv2.VideoCapture(camera_index, backend)
                        if cap.isOpened():
                            print(f"✅ Câmera local {camera_index} conectada (backend: {backend})")
                            return self._configure_camera(cap)
                        cap.release()
                    except:
                        continue
            
            else:  # auto
                # Tentar IP camera primeiro, depois câmera local
                print("🎥 Modo automático: tentando IP camera primeiro...")
                
                # Tentar IP cameras
                for i, ip_cam in enumerate(self.ip_cameras):
                    if ip_cam["enabled"]:
                        url = self.get_ip_camera_url(i)
                        if url:
                            cap = cv2.VideoCapture(url)
                            if cap.isOpened():
                                print(f"✅ IP camera conectada: {ip_cam['name']}")
                                return self._configure_camera(cap)
                            cap.release()
                
                # Se IP camera falhar, tentar câmera local
                print("🎥 IP camera não disponível, tentando câmera local...")
                for i in range(3):  # Tentar até 3 câmeras locais
                    for backend in self.camera_backends:
                        try:
                            cap = cv2.VideoCapture(i, backend)
                            if cap.isOpened():
                                print(f"✅ Câmera local {i} conectada")
                                return self._configure_camera(cap)
                            cap.release()
                        except:
                            continue
        
        except Exception as e:
            print(f"❌ Erro ao criar captura de câmera: {e}")
            if cap:
                cap.release()
        
        return None
    
    def _configure_camera(self, cap: cv2.VideoCapture) -> cv2.VideoCapture:
        """Configura parâmetros da câmera"""
        try:
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.default_width)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.default_height)
            cap.set(cv2.CAP_PROP_FPS, 30)  # 30 FPS
        except:
            pass  # Ignorar erros de configuração
        
        return cap

# Instância global
camera_config = CameraConfig()
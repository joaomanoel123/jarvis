import os
import eel
import subprocess
import platform
import socket

from engine.features import *
from engine.command import *
from engine.auth import recoganize
from engine.camera_config import camera_config


def _find_free_port(preferred=8000, max_tries=20):
    """Encontra uma porta livre começando pela preferida."""
    ports_to_try = [preferred] + [preferred + i for i in range(1, max_tries)]
    for port in ports_to_try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(("localhost", port))
                return port
            except OSError:
                continue
    return preferred  # fallback


def start():
    
    eel.init("docs")

    playAssistantSound()

    @eel.expose
    def init():
        # Detectar sistema operacional e executar script apropriado
        try:
            if platform.system() == "Windows":
                subprocess.call([r'device.bat'])
            else:
                subprocess.call(['./device.sh'])
        except Exception as e:
            print(f"Aviso: Não foi possível executar script de dispositivo: {e}")
        
        eel.hideLoader()
        speak("Ready for Face Authentication")
        
        try:
            # Usar configurações de câmera do .env
            camera_type = camera_config.default_type
            camera_index = camera_config.default_index
            
            print(f"🎥 Usando câmera: tipo={camera_type}, índice={camera_index}")
            
            flag = recoganize.AuthenticateFace(camera_type, camera_index)
            if flag == 1:
                eel.hideFaceAuth()
                speak("Autenticação facial bem-sucedida")
                eel.hideFaceAuthSuccess()
                speak("Olá, bem-vindo João Manoel! Como posso ajudá-lo hoje?")
                eel.hideStart()
                playAssistantSound()
            else:
                speak("Face Authentication Fail")
        except Exception as e:
            print(f"Erro na autenticação facial: {e}")
            speak("Pulando autenticação facial")
            eel.hideLoader()
            eel.hideStart()
            speak("Olá, bem-vindo João Manoel! Como posso ajudá-lo hoje?")
            playAssistantSound()
    
    # Definir porta (suporta variável de ambiente PORT)
    preferred_port = int(os.getenv("PORT", "8000"))
    port = _find_free_port(preferred_port)

    # Abrir navegador usando script dedicado
    def open_browser(port_to_use):
        url = f"http://localhost:{port_to_use}/index.html"
        try:
            if platform.system() == "Windows":
                os.system(f'start msedge.exe --app="{url}"')
                return True
            elif platform.system() == "Darwin":  # macOS
                os.system(f'open -a "Google Chrome" --args --app="{url}"')
                return True
            else:  # Linux
                # Usar script dedicado para abrir navegador
                result = os.system(f'./open_browser.sh "{url}"')
                return result == 0
        except Exception as e:
            print(f"Erro ao abrir navegador: {e}")
            return False
    
    # Tentar abrir navegador
    print("🌐 Iniciando interface web...")
    if not open_browser(port):
        print("⚠️ Navegador não abriu automaticamente")
        print(f"📱 Acesse manualmente: http://localhost:{port}/index.html")

    print(f"🚀 Servidor web iniciando em http://localhost:{port}")
    print("🔄 Pressione Ctrl+C para parar")
    
    try:
        eel.start('index.html', mode=None, host='localhost', port=port, block=True)
    except KeyboardInterrupt:
        print("\n👋 Jarvis finalizado pelo usuário")
    except Exception as e:
        print(f"❌ Erro ao iniciar servidor Eel: {e}")
        print(f"🌐 Verifique se a porta {port} está livre")
        print(f"📱 Ou acesse: http://localhost:{port}/index.html")

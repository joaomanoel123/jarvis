"""
Módulo para importações seguras e tratamento de dependências opcionais
"""
import sys
import warnings

def safe_import(module_name, package=None, fallback=None):
    """
    Importa um módulo de forma segura, retornando um fallback se falhar
    """
    try:
        if package:
            return __import__(module_name, fromlist=[package])
        else:
            return __import__(module_name)
    except ImportError as e:
        print(f"⚠️ Módulo {module_name} não disponível: {e}")
        return fallback

def check_audio_dependencies():
    """
    Verifica se as dependências de áudio estão disponíveis
    """
    pyaudio = safe_import('pyaudio')
    if pyaudio is None:
        print("⚠️ PyAudio não disponível. Funcionalidades de áudio podem não funcionar.")
        print("💡 Instale com: pip install pyaudio")
        return False
    return True

def check_cv2_dependencies():
    """
    Verifica se OpenCV está disponível
    """
    cv2 = safe_import('cv2')
    if cv2 is None:
        print("⚠️ OpenCV não disponível. Reconhecimento facial desabilitado.")
        print("💡 Instale com: pip install opencv-python")
        return False
    return True

def check_face_recognition_dependencies():
    """
    Verifica se face_recognition está disponível
    """
    face_recognition = safe_import('face_recognition')
    if face_recognition is None:
        print("⚠️ face_recognition não disponível. Funcionalidades avançadas de reconhecimento facial desabilitadas.")
        print("💡 Instale com: pip install face_recognition")
        return False
    return True

def check_porcupine_dependencies():
    """
    Verifica se pvporcupine está disponível
    """
    pvporcupine = safe_import('pvporcupine')
    if pvporcupine is None:
        print("⚠️ pvporcupine não disponível. Hotword detection desabilitado.")
        print("💡 Instale com: pip install pvporcupine")
        return False
    return True

def check_tts_dependencies():
    """
    Verifica se pyttsx3 está disponível
    """
    pyttsx3 = safe_import('pyttsx3')
    if pyttsx3 is None:
        print("⚠️ pyttsx3 não disponível. Text-to-speech pode não funcionar.")
        print("💡 Instale com: pip install pyttsx3")
        return False
    return True

def check_all_dependencies():
    """
    Verifica todas as dependências e retorna um relatório
    """
    print("🔍 Verificando dependências...")
    
    dependencies = {
        'audio': check_audio_dependencies(),
        'opencv': check_cv2_dependencies(),
        'face_recognition': check_face_recognition_dependencies(),
        'porcupine': check_porcupine_dependencies(),
        'tts': check_tts_dependencies()
    }
    
    available = sum(dependencies.values())
    total = len(dependencies)
    
    print(f"✅ {available}/{total} dependências disponíveis")
    
    if available < total:
        print("⚠️ Algumas funcionalidades podem estar limitadas")
        print("💡 Execute install_dependencies.sh para instalar dependências faltantes")
    
    return dependencies

if __name__ == "__main__":
    check_all_dependencies()
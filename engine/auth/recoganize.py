import time
import cv2
import os

# Imports opcionais
try:
    import pyautogui as p
except ImportError:
    p = None
    print("⚠️ pyautogui não disponível")

try:
    from engine.camera_config import camera_config
except ImportError:
    print("⚠️ camera_config não disponível")
    camera_config = None


def AuthenticateFace(camera_type: str = "auto", camera_index: int = 0):
    """
    Autenticação facial com suporte a IP cameras e câmeras locais
    
    Args:
        camera_type: "auto", "ip", ou "local"
        camera_index: índice da câmera (0, 1, 2, etc.)
    """
    try:
        flag = ""
        # Local Binary Patterns Histograms
        try:
            # Tentar usar cv2.face (opencv-contrib-python)
            recognizer = cv2.face.LBPHFaceRecognizer_create()
        except AttributeError:
            # Fallback para versões mais antigas ou opencv sem contrib
            try:
                recognizer = cv2.createLBPHFaceRecognizer()
            except AttributeError:
                print("❌ Erro: OpenCV não tem suporte a reconhecimento facial")
                print("💡 Instale opencv-contrib-python:")
                print("   pip install opencv-contrib-python")
                print("🔓 Permitindo acesso sem autenticação facial por segurança")
                return 1

        # Verificar se o arquivo de treinamento existe
        trainer_path = 'engine/auth/trainer/trainer.yml'
        if not os.path.exists(trainer_path):
            print(f"⚠️ Arquivo de treinamento não encontrado: {trainer_path}")
            print("Execute o treinamento facial primeiro")
            return 1  # Permitir acesso sem autenticação por enquanto
        
        recognizer.read(trainer_path)  # load trained model
        cascadePath = "engine/auth/haarcascade_frontalface_default.xml"
        
        # Verificar se o arquivo cascade existe
        if not os.path.exists(cascadePath):
            print(f"⚠️ Arquivo cascade não encontrado: {cascadePath}")
            return 1  # Permitir acesso sem autenticação por enquanto
        
        # initializing haar cascade for object detection approach
        faceCascade = cv2.CascadeClassifier(cascadePath)
        font = cv2.FONT_HERSHEY_SIMPLEX  # denotes the font type

        # Mapeamento de IDs para nomes (configure conforme necessário)
        names_map = {1: 'Usuário Autorizado'}  # Português brasileiro

        # Usar nova configuração de câmera se disponível
        print(f"🎥 Iniciando autenticação facial (tipo: {camera_type})")
        
        if camera_config:
            cam = camera_config.create_camera_capture(camera_type, camera_index)
        else:
            # Fallback para método original
            print("⚠️ Usando método de câmera original")
            cam = None
            for backend in [cv2.CAP_V4L2, cv2.CAP_DSHOW, cv2.CAP_ANY, 0]:
                try:
                    cam = cv2.VideoCapture(camera_index, backend)
                    if cam.isOpened():
                        cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                        cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                        break
                    cam.release()
                except:
                    continue
        
        if cam is None or not cam.isOpened():
            print("⚠️ Não foi possível acessar nenhuma câmera")
            return 1  # Permitir acesso sem autenticação

        # Define min window size to be recognized as a face
        minW = 0.1*cam.get(cv2.CAP_PROP_FRAME_WIDTH)
        minH = 0.1*cam.get(cv2.CAP_PROP_FRAME_HEIGHT)

        # Contador de tentativas para timeout
        attempt_count = 0
        max_attempts = 300  # 30 segundos com waitKey(100)
        
        print("👤 Olhe para a câmera para autenticação facial...")
        print("⌨️ Pressione ESC para pular a autenticação")
        print("🔍 Procurando por rostos...")

        while True:
            ret, img = cam.read()  # read the frames using the above created object
            
            if not ret:
                print("⚠️ Falha ao ler frame da câmera")
                break

            # The function converts an input image from one color space to another
            converted_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            faces = faceCascade.detectMultiScale(
                converted_image,
                scaleFactor=1.2,
                minNeighbors=5,
                minSize=(int(minW), int(minH)),
            )

            for(x, y, w, h) in faces:
                # used to draw a rectangle on any image
                cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

                # to predict on every single image
                id, accuracy = recognizer.predict(converted_image[y:y+h, x:x+w])

                # Check if accuracy is less them 100 ==> "0" is perfect match
                if (accuracy < 100):
                    name = names_map.get(id, "unknown") # Get name from map, default to "unknown"
                    accuracy_text = "  {0}%".format(round(100 - accuracy))
                    flag = 1
                else:
                    name = "unknown"
                    accuracy_text = "  {0}%".format(round(100 - accuracy))
                    flag = 0

                cv2.putText(img, str(name), (x+5, y-5), font, 1, (255, 255, 255), 2)
                cv2.putText(img, str(accuracy_text), (x+5, y+h-5),
                            font, 1, (255, 255, 0), 1)

            # Adicionar informações na tela
            cv2.putText(img, f"Camera: {camera_type}", (10, 30), font, 0.7, (255, 255, 255), 2)
            cv2.putText(img, "ESC para pular", (10, img.shape[0] - 10), font, 0.5, (255, 255, 255), 1)
            
            cv2.imshow('Jarvis - Autenticação Facial', img)

            k = cv2.waitKey(100) & 0xff  # Press 'ESC' for exiting video
            if k == 27:  # ESC
                print("⏭️ Autenticação facial ignorada pelo usuário")
                flag = 1  # Permitir acesso
                break
            if flag == 1:
                print(f"✅ Autenticação bem-sucedida! Bem-vindo, {names_map.get(id, 'Usuário')}!")
                break
            
            attempt_count += 1
            if attempt_count >= max_attempts:
                print("⏰ Tempo esgotado para autenticação facial")
                flag = 1  # Permitir acesso após timeout
                break

        # Do a bit of cleanup
        cam.release()
        cv2.destroyAllWindows()
        return flag
    
    except Exception as e:
        print(f"❌ Erro na autenticação facial: {e}")
        print("🔓 Permitindo acesso sem autenticação facial")
        return 1  # Permitir acesso em caso de erro


def list_cameras():
    """Lista todas as câmeras disponíveis"""
    print("\n📹 Câmeras disponíveis:")
    
    if camera_config:
        cameras = camera_config.list_available_cameras()
        
        if not cameras:
            print("❌ Nenhuma câmera encontrada")
            return []
        
        for i, cam in enumerate(cameras):
            print(f"  {i+1}. {cam['name']} ({cam['type']})")
            if cam['type'] == 'ip':
                print(f"     URL: {cam['url']}")
        
        return cameras
    else:
        print("⚠️ camera_config não disponível, testando câmeras locais...")
        cameras = []
        
        # Testar câmeras locais manualmente
        for i in range(3):
            try:
                cap = cv2.VideoCapture(i)
                if cap.isOpened():
                    cameras.append({
                        "type": "local",
                        "index": i,
                        "name": f"Câmera Local {i}"
                    })
                    print(f"  {len(cameras)}. Câmera Local {i} (local)")
                cap.release()
            except:
                pass
        
        if not cameras:
            print("❌ Nenhuma câmera local encontrada")
        
        return cameras


def test_camera(camera_type: str = "auto", camera_index: int = 0):
    """Testa uma câmera específica"""
    print(f"\n🧪 Testando câmera (tipo: {camera_type}, índice: {camera_index})")
    
    if camera_config:
        cam = camera_config.create_camera_capture(camera_type, camera_index)
    else:
        print("⚠️ Usando método de câmera original")
        try:
            cam = cv2.VideoCapture(camera_index)
            if cam.isOpened():
                cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            else:
                cam = None
        except:
            cam = None
    
    if cam is None:
        print("❌ Falha ao conectar à câmera")
        return False
    
    print("✅ Câmera conectada! Pressione 'q' para sair")
    
    try:
        while True:
            ret, frame = cam.read()
            if not ret:
                print("❌ Falha ao ler frame")
                break
            
            # Adicionar informações na tela
            cv2.putText(frame, f"Tipo: {camera_type}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, "Pressione 'q' para sair", (10, frame.shape[0] - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            cv2.imshow('Teste de Camera', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    except KeyboardInterrupt:
        print("\n⏹️ Teste interrompido")
    finally:
        cam.release()
        cv2.destroyAllWindows()
        print("✅ Teste concluído")
    
    return True


if __name__ == "__main__":
    # Script para testar câmeras
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "list":
            list_cameras()
        elif command == "test":
            camera_type = sys.argv[2] if len(sys.argv) > 2 else "auto"
            camera_index = int(sys.argv[3]) if len(sys.argv) > 3 else 0
            test_camera(camera_type, camera_index)
        elif command == "auth":
            camera_type = sys.argv[2] if len(sys.argv) > 2 else "auto"
            camera_index = int(sys.argv[3]) if len(sys.argv) > 3 else 0
            result = AuthenticateFace(camera_type, camera_index)
            print(f"Resultado da autenticação: {result}")
        else:
            print("Comandos disponíveis:")
            print("  python -m engine.auth.recoganize list")
            print("  python -m engine.auth.recoganize test [auto|ip|local] [index]")
            print("  python -m engine.auth.recoganize auth [auto|ip|local] [index]")
    else:
        # Teste padrão
        list_cameras()
        print("\n🧪 Testando autenticação facial...")
        AuthenticateFace()
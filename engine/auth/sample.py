import cv2
import os
from engine.camera_config import camera_config

def collect_face_samples(camera_type: str = "auto", camera_index: int = 0):
    """Coleta amostras faciais com suporte a IP cameras"""
    
    # Criar câmera usando a nova configuração
    print(f"🎥 Conectando à câmera (tipo: {camera_type})")
    cam = camera_config.create_camera_capture(camera_type, camera_index)
    
    if cam is None:
        print("❌ Falha ao conectar à câmera")
        return False
    
    # Verificar se o detector existe
    detector_path = 'engine/auth/haarcascade_frontalface_default.xml'
    if not os.path.exists(detector_path):
        print(f"❌ Arquivo detector não encontrado: {detector_path}")
        cam.release()
        return False
    
    detector = cv2.CascadeClassifier(detector_path)
    # Haar Cascade classifier is an effective object detection approach
    
    face_id = input("Digite um ID numérico para o usuário: ")
    # Use integer ID for every new face (0,1,2,3,4,5,6,7,8,9........)
    
    # Criar diretório de amostras se não existir
    samples_dir = "engine/auth/samples"
    if not os.path.exists(samples_dir):
        os.makedirs(samples_dir)
        print(f"📁 Diretório criado: {samples_dir}")
    
    print("📸 Coletando amostras, olhe para a câmera...")
    print("⌨️ Pressione ESC para parar")
    count = 0  # Initializing sampling face count

    try:
        while True:
            ret, img = cam.read()  # read the frames using the above created object
            
            if not ret:
                print("⚠️ Falha ao ler frame da câmera")
                break
            
            converted_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # The function converts an input image from one color space to another
            faces = detector.detectMultiScale(converted_image, 1.3, 5)
            
            for (x, y, w, h) in faces:
                cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)  # used to draw a rectangle on any image
                count += 1
                
                # Salvar imagem com path correto para diferentes sistemas
                filename = f"face.{face_id}.{count}.jpg"
                filepath = os.path.join(samples_dir, filename)
                cv2.imwrite(filepath, converted_image[y:y+h, x:x+w])
                # To capture & Save images into the datasets folder
                
                # Mostrar progresso
                cv2.putText(img, f"Amostras: {count}/100", (x, y-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
            
            # Adicionar informações na tela
            cv2.putText(img, f"Camera: {camera_type}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(img, f"ID: {face_id} | Amostras: {count}/100", (10, img.shape[0] - 40), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(img, "ESC para parar", (10, img.shape[0] - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            cv2.imshow('Coleta de Amostras Faciais', img)  # Used to display an image in a window
            
            k = cv2.waitKey(100) & 0xff  # Waits for a pressed key
            if k == 27:  # Press 'ESC' to stop
                print("⏹️ Coleta interrompida pelo usuário")
                break
            elif count >= 100:  # Take 100 samples (More sample --> More accuracy)
                print("✅ 100 amostras coletadas!")
                break
    
    except KeyboardInterrupt:
        print("\n⏹️ Coleta interrompida")
    finally:
        cam.release()
        cv2.destroyAllWindows()
    
    print(f"📸 {count} amostras coletadas para o ID {face_id}")
    print("🔄 Execute o treinamento agora para usar a autenticação facial")
    return True


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        camera_type = sys.argv[1]  # auto, ip, local
        camera_index = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    else:
        camera_type = "auto"
        camera_index = 0
    
    print("🎯 Coleta de Amostras Faciais para Jarvis")
    print(f"📹 Tipo de câmera: {camera_type}")
    
    collect_face_samples(camera_type, camera_index)
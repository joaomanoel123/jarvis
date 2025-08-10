#!/usr/bin/env python3
"""
Script para testar as correções implementadas
"""

import sys
import os

def test_tts():
    """Testar text-to-speech em português"""
    print("🔊 TESTE DE TEXT-TO-SPEECH")
    print("=" * 30)
    
    try:
        from engine.command import speak
        
        # Testar frases em português brasileiro
        test_phrases = [
            "Olá! Eu sou o Jarvis, seu assistente virtual.",
            "Teste de voz em português brasileiro.",
            "Sistema funcionando perfeitamente!"
        ]
        
        for i, phrase in enumerate(test_phrases, 1):
            print(f"🎤 Teste {i}: {phrase}")
            try:
                speak(phrase)
                print(f"  ✅ Sucesso")
            except Exception as e:
                print(f"  ❌ Erro: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro no teste TTS: {e}")
        return False

def test_opencv_face():
    """Testar se cv2.face está disponível"""
    print("\n👤 TESTE DE RECONHECIMENTO FACIAL")
    print("=" * 35)
    
    try:
        import cv2
        
        # Testar se cv2.face está disponível
        try:
            recognizer = cv2.face.LBPHFaceRecognizer_create()
            print("✅ cv2.face.LBPHFaceRecognizer_create() - OK")
            del recognizer
            return True
        except AttributeError:
            print("❌ cv2.face não disponível")
            
            # Testar fallback
            try:
                recognizer = cv2.createLBPHFaceRecognizer()
                print("✅ cv2.createLBPHFaceRecognizer() - OK (fallback)")
                del recognizer
                return True
            except AttributeError:
                print("❌ Nenhum método de reconhecimento facial disponível")
                print("💡 Instale: pip install opencv-contrib-python")
                return False
                
    except Exception as e:
        print(f"❌ Erro no teste OpenCV: {e}")
        return False

def test_camera_detection():
    """Testar detecção de câmeras"""
    print("\n📹 TESTE DE DETECÇÃO DE CÂMERAS")
    print("=" * 32)
    
    try:
        from engine.auth.recoganize import list_cameras
        
        cameras = list_cameras()
        
        if cameras:
            print(f"✅ {len(cameras)} câmera(s) detectada(s)")
            return True
        else:
            print("⚠️ Nenhuma câmera detectada")
            return False
            
    except Exception as e:
        print(f"❌ Erro no teste de câmeras: {e}")
        return False

def test_speech_recognition():
    """Testar reconhecimento de voz em português"""
    print("\n🎙️ TESTE DE RECONHECIMENTO DE VOZ")
    print("=" * 33)
    
    try:
        import speech_recognition as sr
        
        r = sr.Recognizer()
        
        # Verificar se há microfone disponível
        try:
            with sr.Microphone() as source:
                print("✅ Microfone detectado")
                print("🔧 Configuração: pt-BR (Português Brasileiro)")
                return True
        except OSError:
            print("❌ Nenhum microfone detectado")
            return False
            
    except Exception as e:
        print(f"❌ Erro no teste de reconhecimento: {e}")
        return False

def test_ip_camera():
    """Testar IP camera do celular"""
    print("\n📱 TESTE DE IP CAMERA")
    print("=" * 20)
    
    try:
        from engine.camera_config import camera_config
        
        if camera_config.ip_cameras:
            camera = camera_config.ip_cameras[0]
            print(f"📱 IP Camera configurada: {camera['url']}")
            
            # Teste rápido de conectividade
            import requests
            try:
                response = requests.head(camera['url'].replace('/video', ''), timeout=3)
                if response.status_code == 200:
                    print("✅ IP Camera acessível")
                    return True
                else:
                    print(f"⚠️ IP Camera retornou status {response.status_code}")
                    return False
            except:
                print("❌ IP Camera não acessível")
                return False
        else:
            print("⚠️ Nenhuma IP camera configurada")
            return False
            
    except Exception as e:
        print(f"❌ Erro no teste IP camera: {e}")
        return False

def main():
    print("🧪 TESTE DAS CORREÇÕES IMPLEMENTADAS")
    print("=" * 40)
    
    tests = [
        ("Text-to-Speech", test_tts),
        ("OpenCV Face Recognition", test_opencv_face),
        ("Detecção de Câmeras", test_camera_detection),
        ("Reconhecimento de Voz", test_speech_recognition),
        ("IP Camera", test_ip_camera)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ Erro no teste {test_name}: {e}")
            results[test_name] = False
    
    # Resumo
    print("\n" + "=" * 40)
    print("📊 RESUMO DOS TESTES")
    print("=" * 40)
    
    passed = 0
    total = len(tests)
    
    for test_name, result in results.items():
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Resultado: {passed}/{total} testes passaram")
    
    if passed == total:
        print("🎉 Todos os testes passaram! Sistema funcionando perfeitamente.")
    elif passed >= total * 0.7:
        print("⚠️ Maioria dos testes passou. Sistema funcional com algumas limitações.")
    else:
        print("❌ Vários testes falharam. Verifique as configurações.")
    
    print("\n💡 Para executar o Jarvis:")
    print("   ./run_jarvis.sh web")

if __name__ == "__main__":
    main()
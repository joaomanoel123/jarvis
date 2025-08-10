# 📱 Configuração IP Webcam do Celular para Jarvis

## 🔍 **Status Atual:**
- ✅ **Celular detectado:** 192.168.15.7:8080
- ✅ **App IP Webcam funcionando:** Interface web acessível
- ⚠️ **Endpoints de vídeo:** Precisam ser configurados

## 📱 **Configuração no Celular (App IP Webcam):**

### 1. **Verificar configurações do app:**

No seu celular, abra o app **IP Webcam** e verifique:

#### **🎥 Configurações de Vídeo:**
- **Resolução:** 640x480 ou 800x600 (para melhor performance)
- **Qualidade:** 50-80%
- **FPS:** 15-30 fps
- **Formato:** MJPEG (recomendado para compatibilidade)

#### **🌐 Configurações de Rede:**
- **Porta:** 8080 (já configurada)
- **Permitir acesso externo:** Habilitado
- **Autenticação:** Desabilitada (para teste inicial)

#### **⚙️ Configurações Avançadas:**
- **Orientação:** Auto ou Portrait
- **Foco:** Auto
- **Qualidade de áudio:** Desabilitado (para economizar banda)

### 2. **Endpoints disponíveis no IP Webcam:**

Vou atualizar a configuração do Jarvis para usar os endpoints corretos:

```
http://192.168.15.7:8080/video          # Stream MJPEG
http://192.168.15.7:8080/videofeed      # Feed alternativo
http://192.168.15.7:8080/shot.jpg       # Foto única
http://192.168.15.7:8080/photo.jpg      # Foto de alta qualidade
```

## 🔧 **Atualização da Configuração do Jarvis:**

Vou criar múltiplas opções de URL para testar qual funciona melhor:
# 📱 Guia Completo: IP Webcam do Celular para Jarvis

## 🔍 **Diagnóstico Atual:**
- ✅ **Celular conectado:** 192.168.15.7:8080
- ✅ **App IP Webcam funcionando:** Interface web acessível
- ❌ **Endpoints de vídeo:** Timeout (streaming não ativo)

## 📱 **Configuração no Celular (App IP Webcam):**

### 1. **Abrir o App IP Webcam no celular**

### 2. **Configurações Importantes:**

#### **🎥 Configurações de Vídeo:**
- **Resolução:** 640x480 ou 800x600 (para melhor performance)
- **Qualidade:** 50-80%
- **FPS:** 15-30 fps
- **Orientação:** Portrait ou Landscape (conforme preferir)

#### **🌐 Configurações de Servidor:**
- **Porta:** 8080 (já está correto)
- **Permitir acesso externo:** ✅ Habilitado
- **Autenticação:** ❌ Desabilitado (para teste inicial)
- **HTTPS:** ❌ Desabilitado (para simplicidade)

#### **⚙️ Configurações Avançadas:**
- **Formato de vídeo:** MJPEG (melhor compatibilidade)
- **Áudio:** Desabilitado (economiza banda)
- **Detecção de movimento:** Opcional

### 3. **IMPORTANTE: Iniciar o Streaming**

No app IP Webcam, você precisa:

1. **Pressionar "Start Server"** (botão principal)
2. **Aguardar aparecer o IP:** 192.168.15.7:8080
3. **Verificar se está transmitindo:** Deve mostrar a imagem da câmera

## 🔧 **URLs Corretas para IP Webcam:**

Depois de iniciar o servidor, estas URLs devem funcionar:

```
http://192.168.15.7:8080/video          # Stream MJPEG principal
http://192.168.15.7:8080/videofeed      # Feed alternativo  
http://192.168.15.7:8080/shot.jpg       # Foto única
http://192.168.15.7:8080/photo.jpg      # Foto de alta qualidade
```

## 🧪 **Testar Configuração:**

### 1. **Teste no Navegador:**
Abra no navegador: `http://192.168.15.7:8080`
- Deve mostrar a interface do IP Webcam
- Clique em "Browser" para ver o vídeo

### 2. **Teste com Jarvis:**
```bash
# Testar IP camera
python test_ip_camera.py

# Ou usar o script do Jarvis
./run_jarvis.sh test
```

## 🔄 **Se ainda não funcionar:**

### **Opção 1: Verificar IP do Celular**

O IP pode ter mudado. Para descobrir o IP atual:

1. **No celular:** Configurações → WiFi → Informações da rede
2. **Ou no computador:**
   ```bash
   # Escanear rede
   nmap -sn 192.168.15.0/24 | grep -B2 "Nmap scan report"
   ```

### **Opção 2: Usar IP Dinâmico**

Vou criar um script que detecta automaticamente o IP do celular:

```bash
# Executar detector de IP
python detect_phone_ip.py
```

### **Opção 3: URLs Alternativas**

Alguns apps de IP Webcam usam URLs diferentes:

```
http://IP:8080/mjpeg
http://IP:8080/stream
http://IP:8080/cam.mjpeg
```

## 📝 **Atualizar Configuração do Jarvis:**

Se o IP mudou, edite o arquivo `.env`:

```env
# Novo IP do celular
IP_CAMERA_1_URL=http://SEU_NOVO_IP:8080/video
IP_CAMERA_1_URL_ALT1=http://SEU_NOVO_IP:8080/videofeed
IP_CAMERA_1_URL_ALT2=http://SEU_NOVO_IP:8080/shot.jpg
```

## 🚀 **Próximos Passos:**

1. **Verificar se o streaming está ativo no celular**
2. **Testar no navegador primeiro**
3. **Executar:** `python test_ip_camera.py`
4. **Se funcionar:** `./run_jarvis.sh web`

## 💡 **Dicas Importantes:**

- **Mantenha o celular conectado na mesma rede WiFi**
- **Não deixe o celular entrar em modo de economia de energia**
- **Use um suporte para manter o celular estável**
- **Considere usar um carregador para sessões longas**

## 🔧 **Troubleshooting:**

### **Problema:** Timeout nos endpoints
**Solução:** Verificar se o streaming está ativo no app

### **Problema:** IP mudou
**Solução:** Usar o script detector de IP ou configurar IP fixo no roteador

### **Problema:** Qualidade ruim
**Solução:** Ajustar resolução e qualidade no app

### **Problema:** Conexão instável
**Solução:** Verificar sinal WiFi e proximidade do roteador
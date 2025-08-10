# 🚀 Configuração do Jarvis no Render

## 📋 **Arquitetura**
- **Frontend**: GitHub Pages (`https://joaomanoel123.github.io/jarvis`)
- **Backend**: Render (`https://jarvis-tdgt.onrender.com`)
- **IA**: Google Gemini API

## 🔧 **Setup no Render**

### **1. Deploy da API**
1. Acesse: https://render.com
2. Conecte seu repositório GitHub
3. Crie um novo **Web Service**
4. Configure:
   - **Root Directory**: `api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### **2. Configurar Variáveis de Ambiente**
No Render Dashboard, adicione:

```
CORS_ORIGINS = https://joaomanoel123.github.io,https://joaomanoel123.github.io/jarvis
GOOGLE_API_KEY = SUA_NOVA_CHAVE_GOOGLE_AQUI
ENVIRONMENT = production
```

### **3. Obter Nova Chave Google API**
1. Acesse: https://console.cloud.google.com/apis/credentials
2. **REVOGUE** a chave antiga: `AIzaSyB7BqIE33TU5VKdK62J7AfrkmR1-yAnhkQ`
3. Crie nova chave:
   - Clique "CREATE CREDENTIALS" > "API Key"
   - Configure restrições:
     - **Application restrictions**: HTTP referrers
     - **Website restrictions**: 
       - `https://joaomanoel123.github.io/*`
       - `https://*.onrender.com/*`
   - **API restrictions**: Generative Language API
4. Copie a nova chave

### **4. Configurar URL no Frontend**
Atualize a URL da API no arquivo `docs/main.js`:
```javascript
const DEFAULT_API_URL = 'https://jarvis-tdgt.onrender.com';
```

## 🔐 **Segurança Implementada**

### ✅ **Chaves API Seguras**
- ❌ Chaves não ficam no frontend (GitHub Pages)
- ✅ Chaves ficam no backend (Render)
- ✅ Variáveis de ambiente protegidas

### ✅ **CORS Configurado**
- Apenas GitHub Pages pode acessar a API
- Proteção contra uso não autorizado

### ✅ **Restrições de API**
- Chave Google restrita por domínio
- Apenas APIs necessárias habilitadas

## 🧪 **Testando a Configuração**

### **1. Testar API Diretamente**
```bash
curl https://jarvis-tdgt.onrender.com/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "environment": "production",
  "api_configured": true
}
```

### **2. Testar no Frontend**
1. Acesse: https://joaomanoel123.github.io/jarvis
2. Clique no botão ⚙️ (Settings)
3. Verifique se mostra "✅ API conectada!"
4. Digite uma mensagem e teste

## 📝 **URLs Importantes**

- **Frontend**: https://joaomanoel123.github.io/jarvis
- **API**: https://jarvis-tdgt.onrender.com
- **API Docs**: https://jarvis-tdgt.onrender.com/docs
- **Health Check**: https://jarvis-tdgt.onrender.com/health

## 🔄 **Deploy Workflow**

### **Backend (Render)**
1. Push para GitHub
2. Render faz deploy automático
3. Variáveis de ambiente mantidas

### **Frontend (GitHub Pages)**
1. Push para branch `main`
2. GitHub Actions faz deploy
3. Site atualizado automaticamente

## ⚠️ **Importante**

### **Custos**
- Render Free Tier: 750 horas/mês
- API hiberna após 15min de inatividade
- Primeiro request pode demorar (cold start)

### **Limitações**
- Cold start: ~30 segundos
- Timeout: 30 segundos por request
- Memória: 512MB

### **Monitoramento**
- Logs: Render Dashboard
- Métricas: Render Dashboard
- Uptime: Status page do Render

## 🆘 **Troubleshooting**

### **API não responde**
1. Verificar logs no Render
2. Verificar variáveis de ambiente
3. Testar endpoint `/health`

### **Erro de CORS**
1. Verificar `CORS_ORIGINS` no Render
2. Verificar URL do frontend

### **Erro de API Key**
1. Verificar `GOOGLE_API_KEY` no Render
2. Verificar restrições da chave no Google Console
3. Verificar se API está habilitada

---

**Próximo passo**: Configurar as variáveis no Render Dashboard
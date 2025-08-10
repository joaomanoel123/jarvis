# ⚡ Groq API Setup - Jarvis

## 🚀 **Migração para Groq API**

O Jarvis agora suporta a **Groq API** como provedor principal, com fallback para Google Gemini.

### **Por que Groq?**
- ⚡ **Velocidade**: Muito mais rápido que outras APIs
- 🆓 **Gratuito**: Tier gratuito generoso
- 🔄 **Confiável**: Menos problemas de rate limiting
- 🤖 **Modelos**: Llama 3 e outros modelos de ponta

## 🔧 **Configuração no Render**

### **1. Obter Chave da API Groq**
1. Acesse: https://console.groq.com
2. Faça login ou crie uma conta
3. Vá em **API Keys**
4. Clique **Create API Key**
5. Copie a chave (formato: `gsk_...`)

### **2. Configurar no Render Dashboard**
1. Acesse: https://dashboard.render.com
2. Vá no seu serviço `jarvis-tdgt`
3. Clique em **Environment**
4. Adicione a variável:
   ```
   GROQ_API_KEY = gsk_sua_chave_aqui
   ```
5. Clique **Save Changes**

### **3. Verificar Configuração**
- **Health Check**: https://jarvis-tdgt.onrender.com/health
- **Debug**: https://jarvis-tdgt.onrender.com/debug

## 🔄 **Sistema de Fallback**

A API agora funciona com prioridade:

1. **🥇 Groq** (se `GROQ_API_KEY` configurada)
2. **🥈 Google Gemini** (se `GOOGLE_API_KEY` configurada)
3. **❌ Erro** (se nenhuma configurada)

## 📊 **Comparação de Provedores**

| Aspecto | Groq ⚡ | Google Gemini 🤖 |
|---------|---------|------------------|
| **Velocidade** | Muito rápida | Moderada |
| **Custo** | Gratuito generoso | Limitado gratuito |
| **Modelos** | Llama 3, Mixtral | Gemini Pro |
| **Rate Limits** | Altos | Baixos |
| **Latência** | ~200ms | ~1-3s |

## 🧪 **Testando a Configuração**

### **1. Health Check**
```bash
curl https://jarvis-tdgt.onrender.com/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "environment": "production",
  "api_configured": true,
  "api_provider": "groq"
}
```

### **2. Teste de Mensagem**
1. Acesse: https://joaomanoel123.github.io/jarvis
2. Digite: "Olá, você está funcionando?"
3. Veja a resposta rápida do Groq

### **3. Logs Detalhados**
No Render Dashboard → Logs, você verá:
```
📥 Recebida mensagem: Olá, você está funcionando?
🔌 Provedor de API: groq
✅ GROQ API Key configurada: gsk_1234567...
🔄 Chamando Groq API...
📡 Status da resposta Groq: 200
✅ Resposta recebida: Olá! Eu sou JARVIS...
```

## ⚙️ **Configurações do Modelo**

### **Modelo Atual**: `llama3-8b-8192`
- **Contexto**: 8,192 tokens
- **Velocidade**: Muito rápida
- **Qualidade**: Excelente para conversação

### **Parâmetros**:
```json
{
  "model": "llama3-8b-8192",
  "max_tokens": 1000,
  "temperature": 0.7,
  "stream": false
}
```

### **Personalidade JARVIS**:
```
"Você é JARVIS, um assistente virtual inteligente criado por Tony Stark. 
Responda de forma útil, concisa e com a personalidade característica do JARVIS 
- educado, eficiente e ligeiramente formal, mas amigável."
```

## 🔒 **Segurança**

### **Variáveis de Ambiente**
```bash
# Render Dashboard Environment Variables
GROQ_API_KEY=gsk_sua_chave_groq_aqui
GOOGLE_API_KEY=sua_chave_google_aqui  # Fallback
CORS_ORIGINS=https://joaomanoel123.github.io,https://joaomanoel123.github.io/jarvis
ENVIRONMENT=production
```

### **Proteções Implementadas**
- ✅ CORS configurado
- ✅ Rate limiting do Groq
- ✅ Timeout de 30 segundos
- ✅ Logs sem exposição de chaves
- ✅ Fallback automático

## 🚨 **Troubleshooting**

### **Erro 401 - Unauthorized**
- Chave API inválida ou expirada
- Verificar se a chave está correta no Render

### **Erro 429 - Rate Limit**
- Muitas requisições
- Aguardar alguns segundos

### **Timeout**
- Rede lenta
- Groq geralmente é muito rápido (<1s)

### **Fallback para Google**
- Se Groq falhar, usa Google automaticamente
- Logs mostrarão a mudança de provedor

## 📈 **Monitoramento**

### **Métricas Importantes**
- **Tempo de resposta**: ~200-500ms (Groq)
- **Taxa de sucesso**: >99%
- **Fallback rate**: <1%

### **Logs Úteis**
```bash
# Render Dashboard → Logs
🔌 Provedor de API: groq
📡 Status da resposta Groq: 200
✅ Resposta recebida: ...
```

## 🎯 **Próximos Passos**

1. **Configure GROQ_API_KEY** no Render
2. **Teste a velocidade** da nova API
3. **Monitore os logs** para verificar funcionamento
4. **Aproveite** a velocidade do Groq! ⚡

---

**Status**: ✅ Implementado  
**Provedor**: Groq (primário) + Google (fallback)  
**Velocidade**: ~200-500ms  
**Modelo**: llama3-8b-8192
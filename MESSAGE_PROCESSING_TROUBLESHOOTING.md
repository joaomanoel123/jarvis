# 💬 Message Processing Troubleshooting

## 🔍 Diagnóstico de Problemas com Processamento de Mensagens

### **Sintomas Comuns**
- Mensagem fica "processando" indefinidamente
- Erro de timeout ou conexão
- Resposta vazia ou inválida
- API não responde

## 🛠️ **Ferramentas de Debug Implementadas**

### **1. Menu de Configurações Melhorado**
Clique no botão ⚙️ (Settings) para acessar:

1. **🔧 Configurar URL da API** - Alterar endpoint da API
2. **🧪 Testar conexão** - Verificar se API está online
3. **💬 Teste rápido de mensagem** - Enviar mensagem de teste
4. **📊 Ver logs do console** - Instruções para ver logs detalhados

### **2. Logs Detalhados**
Pressione **F12** para abrir DevTools e veja:
```
🤖 Iniciando sequência de inicialização do Jarvis...
🔌 Testando conexão com: https://jarvis-tdgt.onrender.com
📡 Resposta em 1234ms: 200 OK
📝 Dados do health check: {status: "ok", environment: "development", api_configured: true}
✅ API conectada com sucesso!
💬 Enviando mensagem: Olá, você está funcionando?
🔗 Usando API: https://jarvis-tdgt.onrender.com
📡 Resposta da API: 200 OK
📝 Dados recebidos: {reply: "Olá! Eu sou JARVIS..."}
✅ Resposta processada com sucesso
```

### **3. Tratamento de Erros Específicos**

#### **Cold Start (Render)**
```
⏱️ Timeout: A API demorou muito para responder. 
O servidor pode estar iniciando (cold start). 
Tente novamente em 30 segundos.
```

#### **Erro de Rede**
```
🚫 Erro de conexão: Verifique sua internet ou se a API está disponível.
```

#### **API Key Não Configurada**
```
⚠️ Chave da API do Google não configurada no servidor. 
Entre em contato com o administrador.
```

#### **Erro HTTP**
```
❌ Erro HTTP 500: Internal Server Error
```

## 🔧 **Soluções por Problema**

### **1. Cold Start (Mais Comum)**
**Sintoma**: Timeout após 45 segundos
**Causa**: Render hiberna apps gratuitos após 15min de inatividade
**Solução**: 
- Aguarde 30-60 segundos
- Tente novamente
- Use o teste rápido no menu de configurações

### **2. API Key Não Configurada**
**Sintoma**: Erro "missing_api_key"
**Causa**: `GOOGLE_API_KEY` não configurada no Render
**Solução**:
1. Acesse: https://dashboard.render.com
2. Vá no seu serviço `jarvis-tdgt`
3. Environment Variables
4. Adicione: `GOOGLE_API_KEY = SUA_CHAVE_AQUI`

### **3. Erro de CORS**
**Sintoma**: "CORS policy" no console
**Causa**: Configuração incorreta no servidor
**Solução**:
1. Verificar `CORS_ORIGINS` no Render
2. Deve conter: `https://joaomanoel123.github.io,https://joaomanoel123.github.io/jarvis`

### **4. Erro de Rede**
**Sintoma**: "Failed to fetch"
**Causa**: Problemas de conectividade
**Solução**:
- Verificar conexão com internet
- Testar API diretamente: https://jarvis-tdgt.onrender.com/health
- Verificar se Render está online

### **5. Timeout Personalizado**
**Sintoma**: Demora muito para responder
**Causa**: Render free tier pode ser lento
**Solução**: Timeout aumentado para 45 segundos

## 🧪 **Como Testar**

### **Teste Rápido**
1. Clique em ⚙️ (Settings)
2. Escolha "💬 Teste rápido de mensagem"
3. Observe os logs no console (F12)

### **Teste Manual**
1. Digite: "Olá, você está funcionando?"
2. Pressione Enter
3. Observe a resposta

### **Teste de API**
1. Clique em ⚙️ (Settings)
2. Escolha "🧪 Testar conexão"
3. Veja o resultado na tela

## 📊 **Monitoramento**

### **Health Check**
- URL: https://jarvis-tdgt.onrender.com/health
- Resposta esperada:
```json
{
  "status": "ok",
  "environment": "development",
  "api_configured": true
}
```

### **Logs do Render**
- Acesse: https://dashboard.render.com
- Vá no seu serviço
- Clique em "Logs"
- Monitore erros em tempo real

## 🚨 **Problemas Conhecidos**

### **1. Cold Start Delay**
- **Tempo**: 30-60 segundos na primeira requisição
- **Frequência**: Após 15 minutos de inatividade
- **Solução**: Aguardar ou usar serviço pago

### **2. Rate Limiting**
- **Limite**: Depende do plano do Render
- **Sintoma**: Erro 429
- **Solução**: Aguardar ou upgrade do plano

### **3. Memory Limits**
- **Limite**: 512MB no free tier
- **Sintoma**: Erro 500 ou crash
- **Solução**: Otimizar código ou upgrade

## 📋 **Checklist de Troubleshooting**

- [ ] API está online? (teste health check)
- [ ] Google API Key configurada?
- [ ] CORS configurado corretamente?
- [ ] Internet funcionando?
- [ ] Console mostra erros?
- [ ] Render logs mostram problemas?
- [ ] Aguardou tempo suficiente para cold start?

---

**Status**: ✅ Ferramentas implementadas  
**Última atualização**: 2025-08-10  
**Timeout**: 45 segundos  
**Retry**: Manual via interface
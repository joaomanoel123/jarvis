# 🔑 Como Obter Chave Porcupine para Hotword Detection

## ❌ **Problema Atual:**
```
Error in hotword detection: Initialization failed:
  [0] AccessKey is invalid.
  [1] Failed to parse AccessKey
  [2] Picovoice Error (code `00000136`)
```

## ✅ **Solução: Obter Chave Válida**

### **1. 🌐 Acessar o Site do Picovoice**
- Vá para: https://picovoice.ai/
- Clique em "Sign Up" ou "Get Started"

### **2. 📝 Criar Conta Gratuita**
- Preencha os dados:
  - Nome
  - Email
  - Senha
- Confirme o email se necessário

### **3. 🔑 Obter Access Key**
1. Faça login no console: https://console.picovoice.ai/
2. Vá para **"AccessKey"** no menu lateral
3. Copie sua **Access Key** (algo como: `abcd1234efgh5678...`)

### **4. ⚙️ Configurar no Jarvis**

#### **Opção A: Arquivo .env (Recomendado)**
Edite o arquivo `.env` e adicione:
```env
PORCUPINE_ACCESS_KEY=sua_chave_aqui
```

#### **Opção B: Arquivo cookies.json**
Edite `engine/cookies.json`:
```json
{
  "access_key": "sua_chave_aqui",
  "google_api_key": "AIzaSyB7BqIE33TU5VKdK62J7AfrkmR1-yAnhkQ"
}
```

### **5. 🧪 Testar Configuração**
```bash
# Testar hotword
./run_jarvis.sh full

# Ou executar só o teste
python -c "from engine.features import hotword; hotword()"
```

## 📊 **Planos Disponíveis:**

### **🆓 Plano Gratuito:**
- ✅ 1.000 consultas por mês
- ✅ Suficiente para uso pessoal
- ✅ Hotwords: "Jarvis", "Alexa", etc.

### **💰 Planos Pagos:**
- Mais consultas por mês
- Hotwords personalizados
- Suporte comercial

## 🔧 **Configuração Atual do Jarvis:**

### **✅ Hotword Funcionando:**
```bash
./run_jarvis.sh full    # Jarvis completo com hotword
```

### **⚠️ Sem Hotword (Atual):**
```bash
./run_jarvis.sh web     # Interface web apenas
```

## 💡 **Dicas Importantes:**

1. **Guarde sua chave:** Anote em local seguro
2. **Não compartilhe:** Cada chave é pessoal
3. **Monitore uso:** Verifique limite mensal
4. **Teste primeiro:** Use modo web se houver problemas

## 🚀 **Alternativas Sem Hotword:**

Se não quiser configurar o Porcupine agora, você pode:

1. **Usar interface web:** `./run_jarvis.sh web`
2. **Ativar por atalho:** Win + J
3. **Usar comandos diretos** na interface

## 📝 **Status Atual:**

- ❌ **Hotword:** Desabilitado (chave inválida)
- ✅ **Interface Web:** Funcionando
- ✅ **IP Camera:** Configurada
- ✅ **Chatbot Gemini:** Funcionando
- ✅ **Text-to-Speech:** Funcionando

## 🎯 **Próximos Passos:**

1. **Obter chave Porcupine** (opcional)
2. **Configurar no .env**
3. **Testar:** `./run_jarvis.sh full`
4. **Ou continuar usando:** `./run_jarvis.sh web`

---

**🎉 Seu Jarvis funciona perfeitamente mesmo sem hotword!**

**Execute `./run_jarvis.sh web` para usar com interface web + IP camera.**
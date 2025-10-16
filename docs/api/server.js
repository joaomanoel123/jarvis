import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🚀 Iniciando JARVIS API...');

// Verificar Groq API Key
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY não encontrada!');
  process.exit(1);
}

// Inicializar Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('✅ Groq SDK inicializado');

// CORS - Aceitar TODAS as origens
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// ============================================
// ROTAS
// ============================================

// Rota raiz
app.get("/", (req, res) => {
  console.log('✅ GET / - OK');
  res.json({ 
    status: "online", 
    service: "JARVIS API",
    version: "2.0.0",
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/health", (req, res) => {
  console.log('✅ GET /health - OK');
  res.json({ 
    status: "healthy", 
    groq: "ready",
    model: "llama-3.3-70b-versatile",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Comando principal
app.post("/command", async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('📨 POST /command - Mensagem:', message);
    
    if (!message || !message.trim()) {
      console.log('❌ Mensagem vazia');
      return res.status(400).json({ 
        error: true, 
        reply: "Mensagem vazia" 
      });
    }
    
    console.log('🤖 Chamando Groq API...');
    
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Você é JARVIS, assistente virtual inteligente. Responda SEMPRE em português brasileiro de forma educada e concisa." 
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500
    });
    
    const reply = completion.choices[0]?.message?.content || "Erro ao gerar resposta";
    
    console.log('✅ Resposta gerada:', reply.substring(0, 50) + '...');
    
    res.json({ 
      error: false, 
      reply,
      model: "llama-3.3-70b-versatile",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro no comando:', error.message);
    
    let errorMsg = "Erro ao processar comando";
    
    if (error.status === 429) {
      errorMsg = "Limite de requisições atingido. Aguarde alguns segundos.";
    } else if (error.status === 401) {
      errorMsg = "Erro de autenticação. Verifique a API key.";
    }
    
    res.status(error.status || 500).json({ 
      error: true, 
      reply: errorMsg 
    });
  }
});

// Rota 404
app.use((req, res) => {
  console.log(`❌ 404 - Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    error: true,
    message: `Rota não encontrada: ${req.method} ${req.path}`,
    availableRoutes: ['GET /', 'GET /health', 'POST /command']
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({ 
    error: true, 
    reply: "Erro interno do servidor" 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🤖 JARVIS API - Groq');
  console.log('═══════════════════════════════════════');
  console.log(`🌐 Porta: ${PORT}`);
  console.log(`🧠 Modelo: llama-3.3-70b-versatile`);
  console.log(`🔗 Rotas disponíveis:`);
  console.log(`   GET  / - Status`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /command - Processar comando`);
  console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM - Encerrando...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT - Encerrando...');
  process.exit(0);
});

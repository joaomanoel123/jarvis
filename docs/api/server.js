import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Verificar Groq API Key
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY não encontrada!');
  process.exit(1);
}

// Inicializar Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('✅ Groq inicializado');

// CORS TOTALMENTE ABERTO (aceita qualquer origem)
app.use(cors());

// OU CORS CONTROLADO (mais seguro):
// app.use(cors({
//   origin: '*', // Permite TODAS as origens
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Accept']
// }));

app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.get("/", (req, res) => {
  res.json({ 
    status: "online", 
    service: "JARVIS API",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    groq: "ready",
    uptime: Math.floor(process.uptime())
  });
});

app.post("/command", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message?.trim()) {
      return res.status(400).json({ 
        error: true, 
        reply: "Mensagem vazia" 
      });
    }
    
    console.log('📨 Comando:', message);
    
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Você é JARVIS, assistente virtual do Tony Stark. Responda SEMPRE em português brasileiro. Seja educado e conciso." 
        },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500
    });
    
    const reply = completion.choices[0]?.message?.content || "Erro ao gerar resposta";
    
    console.log('✅ Resposta gerada');
    
    res.json({ 
      error: false, 
      reply,
      model: "llama-3.3-70b-versatile",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    let errorMsg = "Erro ao processar comando";
    
    if (error.status === 429) {
      errorMsg = "Limite de requisições atingido. Aguarde.";
    } else if (error.status === 401) {
      errorMsg = "Erro de autenticação da API.";
    }
    
    res.status(error.status || 500).json({ 
      error: true, 
      reply: errorMsg 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🤖 JARVIS API - Groq');
  console.log(`🌐 Porta: ${PORT}`);
  console.log(`🧠 Modelo: llama-3.3-70b-versatile`);
  console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Encerrando...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Encerrando...');
  process.exit(0);
});

/**
 * server.js - JARVIS API com Groq
 * Versão final testada e funcional
 */

import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Verificar se Groq API Key está configurada
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY não encontrada!');
  console.log('Configure no Render Dashboard ou no .env local');
  process.exit(1);
}

// Inicializar Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

console.log('✅ Groq SDK inicializado');

// Configuração CORS permissiva
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (Postman, curl, etc)
    if (!origin) return callback(null, true);
    
    // Permitir todas as origens do GitHub Pages
    if (origin.includes('github.io')) {
      return callback(null, true);
    }
    
    // Permitir localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Por segurança, permitir tudo por enquanto
    callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Headers CORS adicionais
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Modelo padrão
const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// System prompt
const JARVIS_PROMPT = `Você é JARVIS, assistente virtual do Tony Stark.
Responda SEMPRE em português brasileiro.
Seja educado, prestativo e conciso.`;

// ==============================================
// ROTAS
// ==============================================

// Root
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "JARVIS API",
    version: "2.0.0",
    model: DEFAULT_MODEL,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    groq: "ready",
    model: DEFAULT_MODEL,
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Comando principal
app.post("/command", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: true,
        reply: "Mensagem inválida"
      });
    }
    
    console.log('📨 Comando:', message);
    
    // Chamar Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: JARVIS_PROMPT },
        { role: "user", content: message }
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 500
    });
    
    const reply = completion.choices[0]?.message?.content || "Erro ao gerar resposta";
    
    console.log('✅ Resposta gerada');
    
    res.json({
      error: false,
      reply: reply,
      model: DEFAULT_MODEL,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    let errorMsg = "Erro ao processar comando";
    
    if (error.status === 429) {
      errorMsg = "Limite de requisições atingido. Aguarde.";
    } else if (error.status === 401) {
      errorMsg = "Erro de autenticação. Verifique a API key.";
    }
    
    res.status(error.status || 500).json({
      error: true,
      reply: errorMsg
    });
  }
});

// Chat com histórico
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: true,
        reply: "Formato inválido"
      });
    }
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: JARVIS_PROMPT },
        ...messages
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 500
    });
    
    const reply = completion.choices[0]?.message?.content || "Erro";
    
    res.json({
      error: false,
      reply: reply,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro no chat:', error.message);
    
    res.status(500).json({
      error: true,
      reply: "Erro ao processar conversa"
    });
  }
});

// Modelos disponíveis
app.get("/models", (req, res) => {
  res.json({
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Padrão)" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (Rápido)" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" }
    ],
    current: DEFAULT_MODEL
  });
});

// Erro 404
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: "Endpoint não encontrado"
  });
});

// Tratamento de erros global
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
  console.log(`🧠 Modelo: ${DEFAULT_MODEL}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
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

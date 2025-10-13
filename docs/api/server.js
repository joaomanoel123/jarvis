/**
 * server.js - JARVIS API com Groq DIRETO
 * 
 * Versão simplificada SEM Rube - apenas Groq API
 * Mais fácil, mais estável, totalmente GRÁTIS
 */

import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Inicializar Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Verificar se API key está configurada
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY não configurada!');
  console.log('💡 Obtenha gratuitamente em: https://console.groq.com');
  process.exit(1);
}

// Middleware CORS - CORRIGIDO para GitHub Pages
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://joaomanoel123.github.io',
      'http://localhost:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5173',
      'http://localhost:8000'
    ];
    
    // Permitir qualquer subdomínio/subpasta do GitHub Pages
    if (origin.includes('joaomanoel123.github.io') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Por enquanto, permitir todas (desenvolvimento)
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With']
}));

// Headers CORS adicionais (fallback)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Responder imediatamente a OPTIONS (preflight)
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

// System prompt do JARVIS
const JARVIS_SYSTEM_PROMPT = `Você é JARVIS (Just A Rather Very Intelligent System), o assistente virtual do Tony Stark.

Características:
- Seja educado, prestativo e conciso
- Responda SEMPRE em português brasileiro
- Use tom profissional mas amigável
- Seja direto nas respostas
- Se não souber algo, admita honestamente

Você pode:
✅ Responder perguntas gerais
✅ Explicar conceitos
✅ Fazer cálculos
✅ Contar piadas
✅ Dar dicas e sugestões
✅ Conversar naturalmente

NÃO invente informações. Seja preciso.`;

// ==============================================
// ROTAS
// ==============================================

// Health check básico
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "JARVIS API - Groq Direct",
    version: "2.0.0",
    model: DEFAULT_MODEL,
    provider: "Groq",
    timestamp: new Date().toISOString()
  });
});

// Health check detalhado
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    groq: "ready",
    model: DEFAULT_MODEL,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint principal de comandos
app.post("/command", async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validar entrada
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: true,
        reply: "Mensagem inválida. Por favor, envie um texto."
      });
    }
    
    console.log('📨 Comando recebido:', message);
    
    // Chamar Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: JARVIS_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false
    });
    
    const reply = chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";
    
    console.log('✅ Resposta gerada:', reply.substring(0, 100) + '...');
    
    res.json({
      error: false,
      reply: reply,
      model: DEFAULT_MODEL,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro ao processar comando:', error);
    
    // Verificar tipo de erro
    let errorMessage = "Desculpe, ocorreu um erro ao processar seu comando.";
    
    if (error.status === 429) {
      errorMessage = "Limite de requisições atingido. Aguarde alguns segundos.";
    } else if (error.status === 401) {
      errorMessage = "Erro de autenticação. API key inválida.";
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`;
    }
    
    res.status(error.status || 500).json({
      error: true,
      reply: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint de chat com histórico
app.post("/chat", async (req, res) => {
  try {
    const { messages, temperature = 0.7, max_tokens = 500 } = req.body;
    
    // Validar entrada
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: true,
        reply: "Formato de mensagens inválido. Envie um array de mensagens."
      });
    }
    
    console.log('💬 Chat recebido:', messages.length, 'mensagens');
    
    // Adicionar system prompt
    const fullMessages = [
      {
        role: "system",
        content: JARVIS_SYSTEM_PROMPT
      },
      ...messages
    ];
    
    // Chamar Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: fullMessages,
      model: DEFAULT_MODEL,
      temperature,
      max_tokens,
      top_p: 1,
      stream: false
    });
    
    const reply = chatCompletion.choices[0]?.message?.content || "Erro ao gerar resposta.";
    
    console.log('✅ Resposta do chat gerada');
    
    res.json({
      error: false,
      reply: reply,
      model: DEFAULT_MODEL,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro no chat:', error);
    
    res.status(error.status || 500).json({
      error: true,
      reply: "Erro ao processar conversa.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Listar modelos disponíveis
app.get("/models", async (req, res) => {
  try {
    const models = await groq.models.list();
    
    res.json({
      models: models.data.map(m => ({
        id: m.id,
        name: m.id,
        context_window: m.context_window
      })),
      current: DEFAULT_MODEL
    });
  } catch (error) {
    console.error('❌ Erro ao listar modelos:', error);
    
    res.json({
      models: [
        { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
        { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (Rápido)" },
        { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" }
      ],
      current: DEFAULT_MODEL
    });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  
  res.status(500).json({
    error: true,
    reply: "Erro interno do servidor.",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🤖 JARVIS API - Groq Direct');
  console.log('═══════════════════════════════════════');
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`🧠 Modelo: ${DEFAULT_MODEL}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM recebido, encerrando...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT recebido, encerrando...');
  process.exit(0);
});

/**
 * server.js - Rube MCP Server para JARVIS
 * 
 * Backend integrado com Rube.app para processamento de comandos
 * Deploy: Render.com ou qualquer plataforma Node.js
 */

import express from "express";
import cors from "cors";
import { createMcpServer } from "rube/server.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: [
    'https://joaomanoel123.github.io',
    'http://localhost:3000',
    'http://localhost:5500'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Inicializar Rube MCP Server
let mcpServer;
let mcpReady = false;

async function initializeMcpServer() {
  try {
    console.log('🚀 Inicializando Rube MCP Server...');
    
    mcpServer = await createMcpServer({
      apiKey: process.env.RUBE_API_KEY,
      model: process.env.RUBE_MODEL || "groq:llama-3.3-70b-versatile",
      port: PORT,
      integrations: [
        { 
          name: "groq", 
          url: "https://api.groq.com/openai/v1",
          config: {
            apiKey: process.env.GROQ_API_KEY
          }
        },
        { 
          name: "weather", 
          url: "https://api.weatherapi.com/v1",
          config: {
            apiKey: process.env.WEATHER_API_KEY
          }
        }
      ]
    });
    
    mcpReady = true;
    console.log('✅ Rube MCP Server inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar Rube MCP Server:', error);
    mcpReady = false;
  }
}

// Rotas

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "JARVIS API - Rube MCP Server",
    version: "2.0.0",
    mcpReady,
    timestamp: new Date().toISOString()
  });
});

// Status detalhado
app.get("/health", (req, res) => {
  res.json({
    status: mcpReady ? "healthy" : "degraded",
    mcpServer: mcpReady ? "ready" : "not ready",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint principal de comandos
app.post("/command", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: true,
        reply: "Mensagem inválida. Por favor, envie um texto."
      });
    }
    
    console.log('📨 Comando recebido:', message);
    
    // Verificar se MCP está pronto
    if (!mcpReady || !mcpServer) {
      return res.json({
        error: false,
        reply: "Desculpe, ainda estou inicializando. Tente novamente em alguns segundos."
      });
    }
    
    // Processar comando com Rube MCP
    try {
      const response = await mcpServer.chat({
        messages: [
          {
            role: "system",
            content: `Você é JARVIS, um assistente virtual inteligente criado por João Manoel. 
Seja prestativo, conciso e amigável. Responda em português brasileiro.
Você pode executar comandos, responder perguntas e ajudar o usuário.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const reply = response.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";
      
      console.log('✅ Resposta gerada:', reply.substring(0, 100) + '...');
      
      res.json({
        error: false,
        reply: reply,
        timestamp: new Date().toISOString()
      });
      
    } catch (mcpError) {
      console.error('❌ Erro no MCP Server:', mcpError);
      
      res.json({
        error: false,
        reply: getFallbackResponse(message)
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar comando:', error);
    
    res.status(500).json({
      error: true,
      reply: "Desculpe, ocorreu um erro ao processar seu comando.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint de chat com contexto
app.post("/chat", async (req, res) => {
  try {
    const { messages, temperature = 0.7, max_tokens = 500 } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: true,
        reply: "Formato de mensagens inválido."
      });
    }
    
    if (!mcpReady || !mcpServer) {
      return res.json({
        error: false,
        reply: "Sistema ainda inicializando..."
      });
    }
    
    const response = await mcpServer.chat({
      messages: [
        {
          role: "system",
          content: "Você é JARVIS, um assistente virtual inteligente. Seja útil e conciso."
        },
        ...messages
      ],
      temperature,
      max_tokens
    });
    
    const reply = response.choices[0]?.message?.content || "Erro ao gerar resposta.";
    
    res.json({
      error: false,
      reply,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro no chat:', error);
    
    res.status(500).json({
      error: true,
      reply: "Erro ao processar conversa.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Respostas de fallback (quando MCP falha)
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('olá') || lowerMessage.includes('oi')) {
    return "Olá! Como posso ajudá-lo?";
  }
  
  if (lowerMessage.includes('que horas')) {
    const now = new Date();
    return `São ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  if (lowerMessage.includes('que dia')) {
    const now = new Date();
    return `Hoje é ${now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
  }
  
  if (lowerMessage.includes('como você está')) {
    return "Estou funcionando perfeitamente, obrigado por perguntar!";
  }
  
  if (lowerMessage.includes('obrigado')) {
    return "Por nada! Estou aqui para ajudar.";
  }
  
  return "Desculpe, não consegui processar sua solicitação no momento. Tente novamente.";
}

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  
  res.status(500).json({
    error: true,
    reply: "Erro interno do servidor.",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicialização do servidor
async function startServer() {
  try {
    // Inicializar MCP Server primeiro
    await initializeMcpServer();
    
    // Iniciar Express
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════');
      console.log('🤖 JARVIS API - Rube MCP Server');
      console.log('═══════════════════════════════════════');
      console.log(`🌐 Servidor rodando na porta ${PORT}`);
      console.log(`📡 MCP Status: ${mcpReady ? 'Pronto ✅' : 'Não disponível ❌'}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log('═══════════════════════════════════════');
    });
    
    // Tentar reinicializar MCP se falhou
    if (!mcpReady) {
      console.log('⏳ Tentando reinicializar MCP em 10 segundos...');
      setTimeout(initializeMcpServer, 10000);
    }
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM recebido, encerrando graciosamente...');
  if (mcpServer && mcpServer.stop) {
    mcpServer.stop();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT recebido, encerrando graciosamente...');
  if (mcpServer && mcpServer.stop) {
    mcpServer.stop();
  }
  process.exit(0);
});

// Iniciar servidor
startServer();
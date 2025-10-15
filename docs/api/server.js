
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

// CORS permissivo
app.use(cors());
app.use(express.json());

// Log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.get("/", (req, res) => {
  res.json({ status: "online", service: "JARVIS API" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", groq: "ready" });
});

app.post("/command", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message?.trim()) {
      return res.status(400).json({ error: true, reply: "Mensagem vazia" });
    }
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é JARVIS. Responda em português." },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500
    });
    
    const reply = completion.choices[0]?.message?.content || "Erro";
    
    res.json({ error: false, reply });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).json({ error: true, reply: "Erro ao processar" });
  }
});

// Iniciar
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🤖 JARVIS API');
  console.log(`🌐 Porta: ${PORT}`);
  console.log('═══════════════════════════════════════');
});

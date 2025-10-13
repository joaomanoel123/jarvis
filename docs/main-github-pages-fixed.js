/**
 * main-github-pages-fixed.js - VERSÃO COMPLETA
 * 
 * Script unificado para GitHub Pages - SEM ES6 modules
 * Substitui: main.js, core.js, ui.js, api.js
 */

console.log('🚀 JARVIS - Iniciando versão GitHub Pages...');

// ==============================================
// CONFIGURAÇÕES
// ==============================================
const JARVIS_CONFIG = {
    apiUrl: localStorage.getItem('FRONT_API_URL') || '',
    voiceSettings: {
        lang: 'pt-BR',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
    },
    speechRecognition: {
        lang: 'pt-BR',
        continuous: false,
        interimResults: true
    }
};

// ==============================================
// INICIALIZAÇÃO PRINCIPAL
// ==============================================
function initJarvis() {
    console.log('🎬 Iniciando JARVIS...');
    
    // Remover tela de loading imediatamente
    removeLoadingScreen();
    
    // Inicializar componentes
    initSVGAnimations();
    initInterface();
    initSpeechRecognition();
    
    // Exibir mensagem de boas-vindas
    setTimeout(() => {
        showWelcomeMessage();
    }, 500);
    
    console.log('✅ JARVIS inicializado com sucesso!');
}

// ==============================================
// GERENCIAMENTO DE TELA DE LOADING
// ==============================================
function removeLoadingScreen() {
    console.log('🔄 Removendo tela de loading...');
    
    const loadingScreen = document.getElementById("loadingScreen");
    const startSection = document.getElementById("Start");
    
    if (loadingScreen) {
        loadingScreen.classList.add("fade-out");
        
        setTimeout(() => {
            loadingScreen.remove();
            
            if (startSection) {
                startSection.hidden = false;
                requestAnimationFrame(() => {
                    startSection.classList.add("visible");
                    console.log('✅ Tela de início exibida');
                });
            }
        }, 700);
    } else {
        console.warn('⚠️ Loading screen não encontrada');
        if (startSection) {
            startSection.hidden = false;
        }
    }
}

// ==============================================
// ANIMAÇÕES SVG
// ==============================================
function initSVGAnimations() {
    console.log('🎨 Inicializando animações SVG...');
    
    const svgs = document.querySelectorAll('.svg-frame svg');
    svgs.forEach((svg, index) => {
        svg.style.setProperty('--i', index);
    });
    
    const loader = document.getElementById('Loader');
    if (loader) {
        loader.classList.add('active');
    }
}

// ==============================================
// INTERFACE DO USUÁRIO
// ==============================================
function initInterface() {
    console.log('🎮 Inicializando interface...');
    
    const chatbox = document.getElementById('chatbox');
    const sendBtn = document.getElementById('SendBtn');
    const micBtn = document.getElementById('MicBtn');
    const chatBtn = document.getElementById('ChatBtn');
    const settingsBtn = document.getElementById('SettingsBtn');
    
    // Input de texto
    if (chatbox) {
        chatbox.addEventListener('input', function() {
            const hasText = this.value.trim() !== '';
            if (sendBtn) sendBtn.hidden = !hasText;
            if (micBtn) micBtn.hidden = hasText;
        });
        
        chatbox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                handleUserInput(this.value);
                this.value = '';
                if (sendBtn) sendBtn.hidden = true;
                if (micBtn) micBtn.hidden = false;
            }
        });
    }
    
    // Botão enviar
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            if (chatbox && chatbox.value.trim() !== '') {
                handleUserInput(chatbox.value);
                chatbox.value = '';
                this.hidden = true;
                if (micBtn) micBtn.hidden = false;
            }
        });
    }
    
    // Botão microfone
    if (micBtn) {
        micBtn.addEventListener('click', function() {
            console.log('🎤 Microfone ativado');
            startVoiceRecognition();
        });
    }
    
    // Botão chat
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            console.log('💬 Abrindo histórico');
        });
    }
    
    // Botão configurações
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            handleSettings();
        });
    }
}

// ==============================================
// MENSAGEM DE BOAS-VINDAS
// ==============================================
function showWelcomeMessage() {
    const wishMessage = document.getElementById('WishMessage');
    if (!wishMessage) return;
    
    const hour = new Date().getHours();
    let greeting = 'Olá';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Boa tarde';
    } else {
        greeting = 'Boa noite';
    }
    
    // Usar textillate se disponível
    if (typeof $ !== 'undefined' && $.fn && $.fn.textillate) {
        $(wishMessage).text(greeting);
        $(wishMessage).textillate({
            in: { effect: 'fadeIn', delay: 30 }
        });
    } else {
        wishMessage.textContent = greeting;
    }
    
    // Transição para tela principal
    setTimeout(() => {
        transitionToMainScreen();
    }, 3000);
}

// ==============================================
// TRANSIÇÃO DE TELAS
// ==============================================
function transitionToMainScreen() {
    console.log('🔄 Transição para tela principal...');
    
    const startSection = document.getElementById('Start');
    const ovalSection = document.getElementById('Oval');
    
    if (startSection && ovalSection) {
        startSection.classList.add('fade-out');
        
        setTimeout(() => {
            startSection.hidden = true;
            ovalSection.hidden = false;
            ovalSection.classList.add('fade-in');
            
            initWaveCanvas();
        }, 500);
    }
}

// ==============================================
// CANVAS DE ONDAS
// ==============================================
function initWaveCanvas() {
    const canvas = document.getElementById('canvasOne');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.strokeStyle = '#00AAFF';
    ctx.lineWidth = 2;
    
    let phase = 0;
    
    function drawWave() {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
            const y = height / 2 + Math.sin(x * 0.02 + phase) * 30;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        phase += 0.05;
        requestAnimationFrame(drawWave);
    }
    
    drawWave();
}

// ==============================================
// PROCESSAMENTO DE ENTRADA
// ==============================================
function handleUserInput(input) {
    console.log('💬 Usuário disse:', input);
    
    addMessageToChat('user', input);
    processCommand(input);
}

// ==============================================
// CHAT
// ==============================================
function addMessageToChat(sender, message) {
    const chatBody = document.getElementById('chat-canvas-body');
    if (!chatBody) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message mb-2 p-2`;
    messageDiv.style.cssText = sender === 'user' 
        ? 'background: rgba(0, 170, 255, 0.2); border-radius: 8px; text-align: right;'
        : 'background: rgba(255, 255, 255, 0.1); border-radius: 8px;';
    messageDiv.textContent = message;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// ==============================================
// PROCESSAMENTO DE COMANDOS
// ==============================================
function processCommand(command) {
    const lowerCommand = command.toLowerCase().trim();
    
    // Comandos básicos
    if (lowerCommand.includes('olá') || lowerCommand.includes('oi')) {
        respondToUser('Olá! Como posso ajudá-lo?');
    } 
    else if (lowerCommand.includes('que horas')) {
        const now = new Date();
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        respondToUser(`São ${time}`);
    } 
    else if (lowerCommand.includes('que dia')) {
        const now = new Date();
        const date = now.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        respondToUser(`Hoje é ${date}`);
    } 
    else if (lowerCommand.includes('abrir youtube')) {
        respondToUser('Abrindo YouTube...');
        window.open('https://www.youtube.com', '_blank');
    }
    else if (lowerCommand.includes('abrir whatsapp')) {
        respondToUser('Abrindo WhatsApp Web...');
        window.open('https://web.whatsapp.com', '_blank');
    }
    else if (lowerCommand.includes('abrir google')) {
        respondToUser('Abrindo Google...');
        window.open('https://www.google.com', '_blank');
    }
    else if (lowerCommand.includes('pesquisar') || lowerCommand.includes('buscar')) {
        const searchTerm = command.replace(/pesquisar|buscar/gi, '').trim();
        if (searchTerm) {
            respondToUser(`Pesquisando por: ${searchTerm}`);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
        } else {
            respondToUser('O que você gostaria de pesquisar?');
        }
    }
    else if (lowerCommand.includes('obrigado')) {
        respondToUser('Por nada! Estou aqui para ajudar.');
    } 
    else {
        // Tentar enviar para API se configurada
        if (JARVIS_CONFIG.apiUrl) {
            sendToAPI(command);
        } else {
            respondToUser('Desculpe, ainda estou aprendendo. Tente comandos como "que horas são", "abrir YouTube" ou "pesquisar [termo]".');
        }
    }
}

// ==============================================
// RESPOSTA AO USUÁRIO
// ==============================================
function respondToUser(response) {
    console.log('🤖 JARVIS:', response);
    
    addMessageToChat('jarvis', response);
    
    // Text-to-Speech
    speakText(response);
    
    // Atualizar mensagem na tela
    updateWishMessage(response);
}

function updateWishMessage(text) {
    const wishMessage = document.getElementById('WishMessage');
    if (wishMessage) {
        if (typeof $ !== 'undefined' && $.fn && $.fn.textillate) {
            $(wishMessage).text(text);
            $(wishMessage).textillate({
                in: { effect: 'fadeIn', delay: 20 }
            });
        } else {
            wishMessage.textContent = text;
        }
    }
}

// ==============================================
// TEXT-TO-SPEECH
// ==============================================
function speakText(text) {
    if (!('speechSynthesis' in window)) {
        console.warn('⚠️ Text-to-Speech não suportado');
        return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = JARVIS_CONFIG.voiceSettings.lang;
    utterance.rate = JARVIS_CONFIG.voiceSettings.rate;
    utterance.pitch = JARVIS_CONFIG.voiceSettings.pitch;
    utterance.volume = JARVIS_CONFIG.voiceSettings.volume;
    
    window.speechSynthesis.speak(utterance);
}

// ==============================================
// RECONHECIMENTO DE VOZ
// ==============================================
let recognition = null;
let isListening = false;

function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('⚠️ Reconhecimento de voz não suportado');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = JARVIS_CONFIG.speechRecognition.lang;
    recognition.continuous = JARVIS_CONFIG.speechRecognition.continuous;
    recognition.interimResults = JARVIS_CONFIG.speechRecognition.interimResults;
    
    recognition.onstart = () => {
        isListening = true;
        console.log('🎤 Escutando...');
        
        const micBtn = document.getElementById('MicBtn');
        if (micBtn) {
            micBtn.classList.add('listening');
            micBtn.style.backgroundColor = 'rgba(0, 170, 255, 0.3)';
        }
    };
    
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
            console.log('🎤 Reconhecido:', transcript);
            handleUserInput(transcript);
        } else {
            console.log('🎤 Parcial:', transcript);
            updateWishMessage(`Ouvindo: "${transcript}"`);
        }
    };
    
    recognition.onerror = (event) => {
        console.error('❌ Erro no reconhecimento:', event.error);
        
        const errorMessages = {
            'not-allowed': 'Permissão de microfone negada',
            'no-speech': 'Nenhuma fala detectada',
            'audio-capture': 'Erro na captação de áudio',
            'network': 'Erro de rede'
        };
        
        const message = errorMessages[event.error] || `Erro: ${event.error}`;
        respondToUser(message);
    };
    
    recognition.onend = () => {
        isListening = false;
        console.log('🎤 Reconhecimento finalizado');
        
        const micBtn = document.getElementById('MicBtn');
        if (micBtn) {
            micBtn.classList.remove('listening');
            micBtn.style.backgroundColor = '';
        }
    };
}

function startVoiceRecognition() {
    if (!recognition) {
        respondToUser('Reconhecimento de voz não está disponível no seu navegador');
        return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.error('Erro ao iniciar reconhecimento:', error);
            respondToUser('Erro ao ativar o microfone. Tente novamente.');
        }
    }
}

// ==============================================
// API BACKEND
// ==============================================
async function sendToAPI(command) {
    const apiUrl = JARVIS_CONFIG.apiUrl;
    
    if (!apiUrl) {
        respondToUser('API não configurada. Configure nas configurações.');
        return;
    }
    
    try {
        respondToUser('Processando...');
        
        const response = await fetch(`${apiUrl}/command`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: command })
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.reply) {
            respondToUser(data.reply);
        } else {
            respondToUser('Resposta da API inválida');
        }
    } catch (error) {
        console.error('Erro na API:', error);
        respondToUser(`Erro ao conectar com a API: ${error.message}`);
    }
}

// ==============================================
// CONFIGURAÇÕES
// ==============================================
function handleSettings() {
    const current = JARVIS_CONFIG.apiUrl || '';
    const input = prompt('URL do backend (deixe vazio para desativar):', current);
    
    if (input === null) return; // Cancelado
    
    const trimmed = input.trim();
    
    if (trimmed === '') {
        localStorage.removeItem('FRONT_API_URL');
        JARVIS_CONFIG.apiUrl = '';
        respondToUser('API desativada');
    } else {
        localStorage.setItem('FRONT_API_URL', trimmed);
        JARVIS_CONFIG.apiUrl = trimmed;
        respondToUser('API configurada com sucesso');
    }
}

// ==============================================
// INICIALIZAÇÃO AUTOMÁTICA
// ==============================================
// Garantir que inicializa apenas uma vez
let initialized = false;

function safeInit() {
    if (initialized) {
        console.log('⚠️ JARVIS já foi inicializado');
        return;
    }
    
    initialized = true;
    initJarvis();
}

// Tentar inicializar assim que possível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    safeInit();
}

// Também com jQuery se disponível
if (typeof jQuery !== 'undefined') {
    $(document).ready(() => {
        console.log('✅ jQuery ready detectado');
    });
}

console.log('📦 Script JARVIS carregado - aguardando inicialização...');

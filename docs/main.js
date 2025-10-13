/**
 * main-github-pages-fixed.js
 * 
 * Versão do main.js adaptada para GitHub Pages (sem ES6 modules)
 */

console.log('🚀 JARVIS Main Script Iniciando...');

// Verificar se jQuery está carregado
if (typeof jQuery === 'undefined') {
    console.error('❌ jQuery não está carregado!');
} else {
    console.log('✅ jQuery carregado');
}

// Função de inicialização principal
function initJarvis() {
    console.log('🎬 Iniciando JARVIS...');
    
    // Remover tela de loading
    const loadingScreen = document.getElementById("loadingScreen");
    const startSection = document.getElementById("Start");
    
    if (loadingScreen) {
        console.log('🔄 Removendo tela de loading...');
        loadingScreen.classList.add("fade-out");
        setTimeout(() => {
            loadingScreen.remove();
            if (startSection) {
                startSection.hidden = false;
                requestAnimationFrame(() => {
                    startSection.classList.add("visible");
                    console.log('✅ Tela principal exibida');
                });
            }
        }, 700);
    }
    
    // Inicializar animações SVG
    initSVGAnimations();
    
    // Inicializar interface
    initInterface();
    
    // Exibir mensagem de boas-vindas
    showWelcomeMessage();
    
    console.log('✅ JARVIS inicializado com sucesso!');
}

// Inicializar animações SVG
function initSVGAnimations() {
    console.log('🎨 Inicializando animações SVG...');
    
    const svgs = document.querySelectorAll('.svg-frame svg');
    svgs.forEach((svg, index) => {
        svg.style.setProperty('--i', index);
    });
    
    // Iniciar rotação dos SVGs
    const loader = document.getElementById('Loader');
    if (loader) {
        loader.classList.add('active');
    }
}

// Inicializar interface do usuário
function initInterface() {
    console.log('🎮 Inicializando interface...');
    
    // Elementos da interface
    const chatbox = document.getElementById('chatbox');
    const sendBtn = document.getElementById('SendBtn');
    const micBtn = document.getElementById('MicBtn');
    const chatBtn = document.getElementById('ChatBtn');
    const settingsBtn = document.getElementById('SettingsBtn');
    
    // Event listeners para input
    if (chatbox) {
        chatbox.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                if (sendBtn) sendBtn.hidden = false;
                if (micBtn) micBtn.hidden = true;
            } else {
                if (sendBtn) sendBtn.hidden = true;
                if (micBtn) micBtn.hidden = false;
            }
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
    
    // Event listener para botão enviar
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
    
    // Event listener para botão de microfone
    if (micBtn) {
        micBtn.addEventListener('click', function() {
            console.log('🎤 Microfone ativado');
            startSpeechRecognition();
        });
    }
    
    // Event listener para botão de chat
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            console.log('💬 Abrindo histórico de chat');
        });
    }
    
    // Event listener para botão de configurações
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            console.log('⚙️ Abrindo configurações');
        });
    }
}

// Exibir mensagem de boas-vindas
function showWelcomeMessage() {
    const wishMessage = document.getElementById('WishMessage');
    if (wishMessage) {
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
        if (typeof $.fn.textillate !== 'undefined') {
            $(wishMessage).text(greeting);
            $(wishMessage).textillate({
                in: { effect: 'fadeIn', delay: 30 }
            });
        } else {
            wishMessage.textContent = greeting;
        }
        
        // Transição para tela principal após 3 segundos
        setTimeout(() => {
            transitionToMainScreen();
        }, 3000);
    }
}

// Transição para tela principal
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
            
            // Inicializar canvas de ondas
            initWaveCanvas();
        }, 500);
    }
}

// Inicializar canvas de ondas
function initWaveCanvas() {
    const canvas = document.getElementById('canvasOne');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Desenhar onda base
    ctx.strokeStyle = '#00AAFF';
    ctx.lineWidth = 2;
    
    function drawWave() {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
            const y = height / 2 + Math.sin(x * 0.02 + Date.now() * 0.001) * 30;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        requestAnimationFrame(drawWave);
    }
    
    drawWave();
}

// Processar entrada do usuário
function handleUserInput(input) {
    console.log('💬 Usuário disse:', input);
    
    // Adicionar ao histórico de chat
    addMessageToChat('user', input);
    
    // Processar comando
    processCommand(input);
}

// Adicionar mensagem ao chat
function addMessageToChat(sender, message) {
    const chatBody = document.getElementById('chat-canvas-body');
    if (!chatBody) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.textContent = message;
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Processar comando do usuário
function processCommand(command) {
    const lowerCommand = command.toLowerCase().trim();
    
    // Comandos básicos
    if (lowerCommand.includes('olá') || lowerCommand.includes('oi')) {
        respondToUser('Olá! Como posso ajudá-lo?');
    } else if (lowerCommand.includes('que horas')) {
        const now = new Date();
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        respondToUser(`São ${time}`);
    } else if (lowerCommand.includes('que dia')) {
        const now = new Date();
        const date = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        respondToUser(`Hoje é ${date}`);
    } else if (lowerCommand.includes('obrigado')) {
        respondToUser('Por nada! Estou aqui para ajudar.');
    } else {
        respondToUser('Desculpe, ainda estou aprendendo. Tente comandos como "que horas são" ou "que dia é hoje".');
    }
}

// Responder ao usuário
function respondToUser(response) {
    console.log('🤖 JARVIS responde:', response);
    
    // Adicionar ao chat
    addMessageToChat('jarvis', response);
    
    // Falar resposta (se TTS disponível)
    if (typeof window.jarvisTTS !== 'undefined') {
        window.jarvisTTS.speak(response);
    }
}

// Iniciar reconhecimento de voz
function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('❌ Reconhecimento de voz não suportado neste navegador');
        respondToUser('Desculpe, reconhecimento de voz não está disponível no seu navegador.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        console.log('🎤 Escutando...');
        const micBtn = document.getElementById('MicBtn');
        if (micBtn) {
            micBtn.classList.add('listening');
        }
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 Reconhecido:', transcript);
        
        const chatbox = document.getElementById('chatbox');
        if (chatbox) {
            chatbox.value = transcript;
        }
        
        handleUserInput(transcript);
    };
    
    recognition.onerror = function(event) {
        console.error('❌ Erro no reconhecimento de voz:', event.error);
    };
    
    recognition.onend = function() {
        console.log('🎤 Reconhecimento finalizado');
        const micBtn = document.getElementById('MicBtn');
        if (micBtn) {
            micBtn.classList.remove('listening');
        }
    };
    
    recognition.start();
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJarvis);
} else {
    // DOM já está pronto
    initJarvis();
}

// Também inicializar com jQuery se disponível
if (typeof jQuery !== 'undefined') {
    $(document).ready(function() {
        console.log('✅ jQuery ready - JARVIS já deve estar inicializado');
    });
}

console.log('📦 Main script carregado');

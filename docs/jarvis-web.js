// Jarvis Web - Versão para GitHub Pages (CORRIGIDA)
// Funcionalidades principais do assistente virtual

// Configurações globais
let isListening = false;
let recognition = null;
let speechSynthesis = window.speechSynthesis;
let currentVoice = null;

// Inicializar Jarvis Web
function initJarvisWeb() {
    console.log('🤖 Inicializando Jarvis Web...');
    
    // Verificar suporte do navegador
    checkBrowserSupport();
    
    // Configurar reconhecimento de voz
    setupSpeechRecognition();
    
    // Configurar síntese de voz
    setupSpeechSynthesis();
    
    // Sequência de inicialização CORRIGIDA
    console.log('🔄 Iniciando sequência de loading...');
    
    // Aguardar 2 segundos antes de começar
    setTimeout(() => {
        console.log('🔄 Ocultando loader inicial...');
        hideLoader();
        
        // Aguardar 4 segundos para mostrar autenticação facial
        setTimeout(() => {
            console.log('🔐 Simulando autenticação facial...');
            hideFaceAuth();
            
            // Aguardar 3 segundos para mostrar sucesso
            setTimeout(() => {
                console.log('✅ Autenticação bem-sucedida!');
                hideFaceAuthSuccess();
                
                // Aguardar 3 segundos para iniciar interface principal
                setTimeout(() => {
                    console.log('🚀 Iniciando interface principal...');
                    hideStart();
                    speak("Olá! Eu sou o Jarvis Web. Como posso ajudá-lo hoje?");
                }, 3000);
            }, 3000);
        }, 4000);
    }, 2000);
}

// Verificar suporte do navegador
function checkBrowserSupport() {
    const features = {
        speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
        speechSynthesis: 'speechSynthesis' in window,
        webAudio: 'AudioContext' in window || 'webkitAudioContext' in window
    };
    
    console.log('🔍 Recursos do navegador:', features);
    
    if (!features.speechRecognition) {
        console.warn('⚠️ Reconhecimento de voz não suportado');
        showStatus('Reconhecimento de voz não disponível neste navegador', 'error');
    }
    
    if (!features.speechSynthesis) {
        console.warn('⚠️ Síntese de voz não suportada');
        showStatus('Síntese de voz não disponível neste navegador', 'error');
    }
}

// Configurar reconhecimento de voz
function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';
        
        recognition.onstart = function() {
            console.log('🎤 Reconhecimento de voz iniciado');
            isListening = true;
            showStatus('Escutando...', 'processing');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('🗣️ Reconhecido:', transcript);
            
            // Adicionar à interface
            senderText(transcript);
            
            // Processar comando
            handleCommand(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('❌ Erro no reconhecimento:', event.error);
            showStatus('Erro no reconhecimento de voz', 'error');
            isListening = false;
            ShowHood();
        };
        
        recognition.onend = function() {
            console.log('🔇 Reconhecimento de voz finalizado');
            isListening = false;
            ShowHood();
        };
    }
}

// Configurar síntese de voz
function setupSpeechSynthesis() {
    if ('speechSynthesis' in window) {
        // Aguardar carregamento das vozes
        speechSynthesis.onvoiceschanged = function() {
            const voices = speechSynthesis.getVoices();
            const portugueseVoices = voices.filter(voice => 
                voice.lang.includes('pt') || voice.lang.includes('BR')
            );
            
            if (portugueseVoices.length > 0) {
                currentVoice = portugueseVoices[0];
            } else {
                currentVoice = voices[0];
            }
            
            console.log('🔊 Voz configurada:', currentVoice?.name);
        };
    }
}

// Iniciar reconhecimento de voz
function startSpeechRecognition() {
    if (recognition && !isListening) {
        try {
            recognition.start();
        } catch (error) {
            console.error('Erro ao iniciar reconhecimento:', error);
            showStatus('Erro ao acessar microfone', 'error');
        }
    } else if (!recognition) {
        showStatus('Reconhecimento de voz não disponível', 'error');
        // Fallback para input de texto
        $('#chatbox').focus();
    }
}

// Função de fala
function speak(text) {
    const speechEnabled = localStorage.getItem('jarvis_speech_enabled') !== 'false';
    
    if (!speechEnabled || !('speechSynthesis' in window)) {
        console.log('🔇 Fala desabilitada ou não suportada');
        return;
    }
    
    // Cancelar fala anterior
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (currentVoice) {
        utterance.voice = currentVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = function() {
        console.log('🗣️ Falando:', text);
    };
    
    utterance.onend = function() {
        console.log('✅ Fala concluída');
    };
    
    utterance.onerror = function(event) {
        console.error('❌ Erro na síntese de voz:', event.error);
    };
    
    speechSynthesis.speak(utterance);
}

// Processar comandos
function handleCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    console.log('🎯 Processando comando:', command);
    
    // Comandos específicos
    if (lowerCommand.includes('abrir') || lowerCommand.includes('abra')) {
        handleOpenCommand(command);
    } else if (lowerCommand.includes('pesquisar') || lowerCommand.includes('pesquise') || lowerCommand.includes('buscar')) {
        handleSearchCommand(command);
    } else if (lowerCommand.includes('youtube') || lowerCommand.includes('reproduzir') || lowerCommand.includes('tocar')) {
        handleYouTubeCommand(command);
    } else if (lowerCommand.includes('hora') || lowerCommand.includes('horas')) {
        handleTimeCommand();
    } else if (lowerCommand.includes('data') || lowerCommand.includes('hoje')) {
        handleDateCommand();
    } else if (lowerCommand.includes('clima') || lowerCommand.includes('tempo')) {
        handleWeatherCommand(command);
    } else if (lowerCommand.includes('piada') || lowerCommand.includes('engraçado')) {
        handleJokeCommand();
    } else if (lowerCommand.includes('calculadora') || lowerCommand.includes('calcular')) {
        handleCalculatorCommand(command);
    } else {
        // Comando geral - usar IA
        handleAICommand(command);
    }
}

// Comando para abrir sites
function handleOpenCommand(command) {
    const sites = {
        'google': 'https://www.google.com',
        'youtube': 'https://www.youtube.com',
        'facebook': 'https://www.facebook.com',
        'instagram': 'https://www.instagram.com',
        'twitter': 'https://www.twitter.com',
        'github': 'https://www.github.com',
        'linkedin': 'https://www.linkedin.com',
        'whatsapp': 'https://web.whatsapp.com',
        'gmail': 'https://mail.google.com',
        'netflix': 'https://www.netflix.com'
    };
    
    let siteFound = false;
    
    for (const [name, url] of Object.entries(sites)) {
        if (command.toLowerCase().includes(name)) {
            window.open(url, '_blank');
            const response = `Abrindo ${name} para você!`;
            receiverText(response);
            speak(response);
            siteFound = true;
            break;
        }
    }
    
    if (!siteFound) {
        const response = "Desculpe, não reconheci qual site você quer abrir. Tente: 'abrir Google', 'abrir YouTube', etc.";
        receiverText(response);
        speak(response);
    }
}

// Comando de pesquisa
function handleSearchCommand(command) {
    const searchTerm = command.replace(/pesquisar|pesquise|buscar|busque|no google|google/gi, '').trim();
    
    if (searchTerm) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
        window.open(searchUrl, '_blank');
        
        const response = `Pesquisando "${searchTerm}" no Google!`;
        receiverText(response);
        speak(response);
    } else {
        const response = "O que você gostaria de pesquisar?";
        receiverText(response);
        speak(response);
    }
}

// Comando do YouTube
function handleYouTubeCommand(command) {
    const searchTerm = command.replace(/youtube|reproduzir|tocar|no youtube/gi, '').trim();
    
    if (searchTerm) {
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
        window.open(youtubeUrl, '_blank');
        
        const response = `Procurando "${searchTerm}" no YouTube!`;
        receiverText(response);
        speak(response);
    } else {
        window.open('https://www.youtube.com', '_blank');
        const response = "Abrindo YouTube para você!";
        receiverText(response);
        speak(response);
    }
}

// Comando de hora
function handleTimeCommand() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const response = `Agora são ${timeString}.`;
    receiverText(response);
    speak(response);
}

// Comando de data
function handleDateCommand() {
    const now = new Date();
    const dateString = now.toLocaleDateString('pt-BR', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const response = `Hoje é ${dateString}.`;
    receiverText(response);
    speak(response);
}

// Comando de clima (simulado)
function handleWeatherCommand(command) {
    const response = "Desculpe, a funcionalidade de clima ainda não está disponível na versão web. Você pode verificar o clima em sites como tempo.com ou climatempo.com.br";
    receiverText(response);
    speak(response);
}

// Comando de piada
function handleJokeCommand() {
    const jokes = [
        "Por que os pássaros voam para o sul no inverno? Porque é longe demais para ir andando!",
        "O que o pato disse para a pata? Vem quá!",
        "Por que o livro de matemática estava triste? Porque tinha muitos problemas!",
        "O que a impressora falou para a outra impressora? Essa folha é sua ou é impressão minha?",
        "Por que o computador foi ao médico? Porque estava com vírus!"
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    receiverText(randomJoke);
    speak(randomJoke);
}

// Comando de calculadora
function handleCalculatorCommand(command) {
    try {
        // Extrair expressão matemática básica
        const mathExpression = command.replace(/calculadora|calcular|quanto é|qual é/gi, '').trim();
        
        // Substituir palavras por símbolos
        const expression = mathExpression
            .replace(/mais|\+/gi, '+')
            .replace(/menos|-/gi, '-')
            .replace(/vezes|multiplicado por|\*/gi, '*')
            .replace(/dividido por|\//gi, '/')
            .replace(/[^0-9+\-*/().\s]/g, '');
        
        if (expression) {
            // Avaliação segura apenas de operações básicas
            const result = Function('"use strict"; return (' + expression + ')')();
            
            if (typeof result === 'number' && !isNaN(result)) {
                const response = `O resultado é ${result}.`;
                receiverText(response);
                speak(response);
            } else {
                throw new Error('Resultado inválido');
            }
        } else {
            throw new Error('Expressão não reconhecida');
        }
    } catch (error) {
        const response = "Desculpe, não consegui calcular isso. Tente algo como: 'calcular 2 mais 2' ou 'quanto é 10 vezes 5'.";
        receiverText(response);
        speak(response);
    }
}

// Comando de IA (Google Gemini)
function handleAICommand(command) {
    const apiKey = localStorage.getItem('jarvis_api_key');
    
    if (!apiKey) {
        const response = "Para usar a IA, você precisa configurar sua chave API do Google Gemini nas configurações.";
        receiverText(response);
        speak(response);
        return;
    }
    
    showStatus('Processando com IA...', 'processing');
    
    // Chamar API do Google Gemini
    callGeminiAPI(command, apiKey);
}

// Chamar API do Google Gemini
async function callGeminiAPI(query, apiKey) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: query
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024
                }
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                receiverText(aiResponse);
                speak(aiResponse);
                showStatus('Resposta gerada!', 'success');
            } else {
                throw new Error('Resposta vazia da IA');
            }
        } else {
            throw new Error(`Erro na API: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro na API do Gemini:', error);
        
        const errorResponse = "Desculpe, não consegui processar sua solicitação no momento. Verifique sua chave API nas configurações.";
        receiverText(errorResponse);
        speak(errorResponse);
        showStatus('Erro na IA', 'error');
    }
}

// Função para criar partículas animadas
function createParticles() {
    const canvas = document.getElementById('canvasOne');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Criar partículas
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1
        });
    }
    
    // Animar partículas
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Rebater nas bordas
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Desenhar partícula
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = '#00AAFF';
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Inicializar partículas quando a interface principal for mostrada
setInterval(() => {
    if (!document.getElementById('Oval').hidden) {
        createParticles();
    }
}, 100);

// Exportar funções globais
window.initJarvisWeb = initJarvisWeb;
window.startSpeechRecognition = startSpeechRecognition;
window.handleCommand = handleCommand;
window.speak = speak;

console.log('🚀 Jarvis Web CORRIGIDO carregado com sucesso!');
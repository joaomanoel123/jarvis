$(document).ready(function () {

    // Aguardar configurações serem carregadas
    setTimeout(() => {
        initializeJarvis();
    }, 500);
    
    function initializeJarvis() {
        console.log('🤖 Inicializando Jarvis para GitHub Pages...');
        
        // Esconder tela de loading inicial
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        // Verificar se as configurações estão disponíveis
        if (!window.jarvisConfig) {
            console.error('❌ Configurações não carregadas!');
            return;
        }
        
        const config = window.jarvisConfig;
        console.log('🌐 Ambiente:', config.getEnvironment());
        console.log('🔗 API URL:', config.getApiUrl());
        
        // Inicializar sequência de startup para GitHub Pages
        startGitHubPagesSequence();
        
        // Configurar animações de texto (com fallback)
        setupTextAnimations();
        
        // Configurar SiriWave
        setupSiriWave();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('✅ Jarvis inicializado com sucesso!');
    }
    
    function startGitHubPagesSequence() {
        console.log('🚀 Iniciando sequência de startup...');
        
        // Sequência de inicialização mais rápida e fluida
        setTimeout(() => {
            console.log('👤 Iniciando Face Auth...');
            $("#Loader").attr("hidden", true);
            $("#FaceAuth").attr("hidden", false);
            $("#WishMessage").text("Autenticando...");
        }, 1500);
        
        setTimeout(() => {
            console.log('✅ Face Auth Success...');
            $("#FaceAuth").attr("hidden", true);
            $("#FaceAuthSuccess").attr("hidden", false);
            $("#WishMessage").text("Autenticação bem-sucedida!");
        }, 3000);
        
        setTimeout(() => {
            console.log('👋 Hello Greet...');
            $("#FaceAuthSuccess").attr("hidden", true);
            $("#HelloGreet").attr("hidden", false);
            $("#WishMessage").text("Olá, bem-vindo João Manoel!");
        }, 4500);
        
        setTimeout(() => {
            console.log('🎯 Carregando interface principal...');
            $("#Start").attr("hidden", true);
            $("#Oval").addClass("animate__animated animate__zoomIn");
            $("#Oval").attr("hidden", false);
            $("#WishMessage").text("Pergunte-me qualquer coisa");
            
            // Preparar mensagem de boas-vindas
            setTimeout(() => {
                if (window.jarvisTTS && window.jarvisTTS.speak) {
                    window.jarvisTTS.queueMessage = 'Olá João Manoel! Como posso ajudá-lo hoje?';
                    console.log('🎤 Mensagem preparada para falar após interação do usuário');
                }
            }, 1000);
        }, 6000);
    }
    
    function setupTextAnimations() {
        // Verificar se textillate está disponível
        if (typeof $.fn.textillate === 'function') {
            try {
                $('.text').textillate({
                    loop: true,
                    sync: true,
                    in: {
                        effect: "bounceIn",
                    },
                    out: {
                        effect: "bounceOut",
                    },
                });

                $('.siri-message').textillate({
                    loop: true,
                    sync: true,
                    in: {
                        effect: "fadeInUp",
                    },
                    out: {
                        effect: "fadeOutUp",
                    },
                });
                console.log('🎨 Animações de texto configuradas com textillate');
            } catch (error) {
                console.warn('⚠️ Erro ao configurar textillate:', error);
                setupFallbackAnimations();
            }
        } else {
            console.warn('⚠️ Textillate não disponível, usando animações CSS básicas');
            setupFallbackAnimations();
        }
    }
    
    function setupFallbackAnimations() {
        // Fallback para animações CSS simples
        $('.text, .siri-message').addClass('animate__animated animate__fadeIn');
        console.log('🎨 Animações CSS básicas configuradas');
    }
    
    let siriWave = null;
    
    function setupSiriWave() {
        const container = document.getElementById("siri-container");
        if (!container) {
            console.warn('⚠️ Container siri-container não encontrado');
            return;
        }
        
        // Verificar se SiriWave está disponível
        if (typeof SiriWave === 'undefined') {
            console.warn('⚠️ SiriWave não disponível, tentando carregar...');
            // Tentar carregar SiriWave via CDN como fallback
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/siriwave/dist/siriwave.umd.min.js';
            script.onload = function() {
                console.log('✅ SiriWave carregado via CDN, tentando configurar novamente...');
                setTimeout(setupSiriWave, 500); // Tentar novamente após carregamento
            };
            script.onerror = function() {
                console.error('❌ Falha ao carregar SiriWave via CDN');
            };
            document.head.appendChild(script);
            return;
        }
        
        try {
            siriWave = new SiriWave({
                container: container,
                width: container.clientWidth || 320,
                height: 160,
                style: "ios9",
                amplitude: 1,
                speed: 0.30,
                frequency: 6,
                color: "#00AAFF",
                autostart: false // Não iniciar automaticamente
            });
            
            // Configurar redimensionamento responsivo
            window.addEventListener('resize', function() {
                if (siriWave && siriWave.canvas) {
                    try {
                        const newWidth = container.clientWidth || 320;
                        siriWave.canvas.style.width = newWidth + 'px';
                    } catch (resizeError) {
                        console.warn('⚠️ Erro ao redimensionar SiriWave:', resizeError);
                    }
                }
            });
            
            console.log('🌊 SiriWave configurado com sucesso');
        } catch (error) {
                console.error('⚠️ Erro ao configurar SiriWave:', error);
            // Fallback: criar um placeholder visual simples
            container.innerHTML = '<div style="width: 100%; height: 160px; background: linear-gradient(45deg, #00AAFF, #0066CC); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🌊 Visualizador de Áudio</div>';
        }
    }
    
    function setupEventListeners() {
        // Listener para ativar TTS após primeira interação
        let firstInteraction = true;
        function activateTTSOnFirstInteraction() {
            if (firstInteraction && window.jarvisTTS && window.jarvisTTS.queueMessage) {
                firstInteraction = false;
                setTimeout(() => {
                    window.jarvisTTS.speak(window.jarvisTTS.queueMessage);
                    window.jarvisTTS.queueMessage = null;
                    console.log('🎤 Mensagem de boas-vindas ativada após interação');
                }, 500);
            }
        }
        
        // Adicionar listeners para primeira interação
        document.addEventListener('click', activateTTSOnFirstInteraction, { once: true });
        document.addEventListener('keydown', activateTTSOnFirstInteraction, { once: true });
        document.addEventListener('touchstart', activateTTSOnFirstInteraction, { once: true });
        
        // Botão do microfone
        $("#MicBtn").click(function () {
            console.log('🎤 Botão de microfone clicado');
            startSpeechRecognition();
        });
        
        // Botão de envio
        $("#SendBtn").click(function () {
            const message = $("#chatbox").val().trim();
            if (message) {
                sendMessage(message);
            }
        });
        
        // Campo de texto
        $("#chatbox").keyup(function () {
            const message = $("#chatbox").val();
            toggleSendButton(message);
        });
        
        $("#chatbox").keypress(function (e) {
            if (e.which === 13) { // Enter
                const message = $("#chatbox").val().trim();
                if (message) {
                    sendMessage(message);
                }
            }
        });
        
        // Botão de configurações
        $("#SettingsBtn").click(function () {
            if (window.jarvisConfig) {
                window.jarvisConfig.showQuickSettings();
            }
        });
        
        // Atalhos de teclado
        document.addEventListener('keyup', function(e) {
            // Cmd+J (Mac) ou Ctrl+J (Windows/Linux) para ativar microfone
            if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                console.log('⌨️ Atalho de voz ativado (Cmd/Ctrl+J)');
                startSpeechRecognition();
            }
            
            // Espaço para ativar microfone (apenas se não estiver digitando)
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                console.log('⌨️ Atalho de voz ativado (Espaço)');
                startSpeechRecognition();
            }
        });
    }
    
    function toggleSendButton(message) {
        if (message.length === 0) {
            $("#MicBtn").attr('hidden', false);
            $("#SendBtn").attr('hidden', true);
        } else {
            $("#MicBtn").attr('hidden', true);
            $("#SendBtn").attr('hidden', false);
        }
    }
    
    function startSpeechRecognition() {
        console.log('🎤 Iniciando reconhecimento de voz...');
        
        // Verificar se o sistema de reconhecimento está disponível
        if (!window.jarvisSpeechRecognition || !window.jarvisSpeechRecognition.isAvailable()) {
            console.warn('⚠️ Sistema de reconhecimento de voz não disponível');
            $("#WishMessage").text("Reconhecimento de voz não disponível. Use o campo de texto.");
            
            setTimeout(() => {
                $("#WishMessage").text("Pergunte-me qualquer coisa");
            }, 3000);
            return;
        }
        
        const speechRecognition = window.jarvisSpeechRecognition;
        
        // Se já está ativo, parar
        if (speechRecognition.isActive()) {
            console.log('🛑 Parando reconhecimento ativo...');
            speechRecognition.stop();
            resetInterface();
            return;
        }
        
        // Configurar callbacks
        speechRecognition.onStart(() => {
            console.log('🎤 Reconhecimento iniciado');
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            
            // Ativar SiriWave
            if (siriWave) {
                siriWave.start();
            }
            
            // Atualizar visual do botão
            $('#MicBtn').html('<i class="bi bi-mic-fill"></i>');
            $('#MicBtn').css('background', 'rgba(255, 0, 0, 0.3)');
            $("#WishMessage").text("Escutando... Fale agora!");
        });
        
        speechRecognition.onInterim((transcript) => {
            console.log('⏳ Transcrição parcial:', transcript);
            $("#WishMessage").text(`Ouvindo: "${transcript}"`);
        });
        
        speechRecognition.onResult((transcript, confidence) => {
            console.log('✅ Transcrição final:', transcript);
            console.log('🎯 Confiança:', (confidence * 100).toFixed(1) + '%');
            
            if (transcript.trim()) {
                $("#chatbox").val(transcript);
                $("#WishMessage").text(`Processando: "${transcript}"`);
                
                // Processar comando automaticamente
                setTimeout(() => {
                    sendMessage(transcript);
                }, 500);
            }
        });
        
        speechRecognition.onError((error, message) => {
            console.error('❌ Erro no reconhecimento:', error, message);
            $("#WishMessage").text(`Erro: ${message}`);
            resetInterface();
            
            // Voltar para interface principal após erro
            setTimeout(() => {
                $("#SiriWave").attr("hidden", true);
                $("#Oval").attr("hidden", false);
                $("#WishMessage").text("Pergunte-me qualquer coisa");
            }, 3000);
        });
        
        speechRecognition.onEnd(() => {
            console.log('🛑 Reconhecimento finalizado');
            resetInterface();
        });
        
        // Iniciar reconhecimento
        const started = speechRecognition.start();
        if (!started) {
            console.error('❌ Falha ao iniciar reconhecimento');
            resetInterface();
        }
    }
    
    function resetInterface() {
        $('#MicBtn').html('<i class="bi bi-mic"></i>');
        $('#MicBtn').css('background', '');
        
        // Parar SiriWave
        if (siriWave) {
            siriWave.stop();
        }
    }
    
    function sendMessage(message) {
        if (!message || !message.trim()) {
            return;
        }
        
        console.log('📤 Enviando mensagem:', message);
        
        // Verificar comandos locais primeiro
        if (handleLocalCommands(message)) {
            return;
        }
        
        // Mostrar interface de processamento
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        
        // Ativar SiriWave
        if (siriWave) {
            siriWave.start();
        }
        
        $("#WishMessage").text("Processando sua mensagem...");
        
        // Enviar para API
        sendToAPI(message)
            .then(response => {
                console.log('✅ Resposta recebida:', response);
                $("#WishMessage").text(response);
                
                // Falar resposta se TTS estiver ativo
                if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                    window.jarvisTTS.speak(response);
                }
            })
            .catch(error => {
                console.error('❌ Erro na API:', error);
                $("#WishMessage").text(`Erro: ${error.message}`);
            })
            .finally(() => {
                // Parar SiriWave
                if (siriWave) {
                    siriWave.stop();
                }
                
                // Limpar input e resetar botões
                $("#chatbox").val("");
                $("#MicBtn").attr('hidden', false);
                $("#SendBtn").attr('hidden', true);
                
                // Voltar para a tela principal após 5 segundos
                setTimeout(() => {
                    $("#SiriWave").attr("hidden", true);
                    $("#Oval").attr("hidden", false);
                    $("#WishMessage").text("Pergunte-me qualquer coisa");
                }, 5000);
            });
    }
    
    function handleLocalCommands(message) {
        const msg = message.toLowerCase().trim();
        console.log('🔍 Verificando comando local:', msg);
        
        // Função auxiliar para abrir sites
        function openSite(url, siteName, message) {
            console.log(`✅ Comando ${siteName} detectado!`);
            window.open(url, '_blank');
            $("#WishMessage").text(message);
            
            if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                window.jarvisTTS.speak(message);
            }
            
            setTimeout(() => {
                $("#WishMessage").text("Pergunte-me qualquer coisa");
            }, 3000);
            return true;
        }
        
        // Comandos do WhatsApp
        const whatsappKeywords = [
            'whatsapp', 'whats app', 'whats', 'zap', 'zapzap',
            'abrir whatsapp', 'abra whatsapp', 'abre whatsapp',
            'abrir whats', 'abra whats', 'abre whats'
        ];
        if (whatsappKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://web.whatsapp.com', 'WhatsApp', 'Abrindo WhatsApp Web para você!');
        }
        
        // Comandos do YouTube
        const youtubeKeywords = [
            'youtube', 'you tube', 'abrir youtube', 'abra youtube', 'abre youtube'
        ];
        if (youtubeKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://www.youtube.com', 'YouTube', 'Abrindo YouTube para você!');
        }
        
        // Comandos do Google
        const googleKeywords = [
            'google', 'abrir google', 'abra google', 'abre google', 'pesquisar no google'
        ];
        if (googleKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://www.google.com', 'Google', 'Abrindo Google para você!');
        }
        
        // Comandos do Gmail
        const gmailKeywords = [
            'gmail', 'email', 'e-mail', 'abrir gmail', 'abra gmail', 'abre gmail'
        ];
        if (gmailKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://mail.google.com', 'Gmail', 'Abrindo Gmail para você!');
        }
        
        // Comandos do Facebook
        const facebookKeywords = [
            'facebook', 'face', 'fb', 'abrir facebook', 'abra facebook', 'abre facebook'
        ];
        if (facebookKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://www.facebook.com', 'Facebook', 'Abrindo Facebook para você!');
        }
        
        // Comandos do Instagram
        const instagramKeywords = [
            'instagram', 'insta', 'ig', 'abrir instagram', 'abra instagram', 'abre instagram'
        ];
        if (instagramKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://www.instagram.com', 'Instagram', 'Abrindo Instagram para você!');
        }
        
        // Comandos do Twitter/X
        const twitterKeywords = [
            'twitter', 'x', 'abrir twitter', 'abra twitter', 'abre twitter', 'abrir x', 'abra x'
        ];
        if (twitterKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://twitter.com', 'Twitter', 'Abrindo Twitter para você!');
        }
        
        // Comandos do LinkedIn
        const linkedinKeywords = [
            'linkedin', 'linked in', 'abrir linkedin', 'abra linkedin', 'abre linkedin'
        ];
        if (linkedinKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://www.linkedin.com', 'LinkedIn', 'Abrindo LinkedIn para você!');
        }
        
        // Comandos do GitHub
        const githubKeywords = [
            'github', 'git hub', 'abrir github', 'abra github', 'abre github'
        ];
        if (githubKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://github.com', 'GitHub', 'Abrindo GitHub para você!');
        }
        
        // Comandos do Netflix
        const netflixKeywords = [
            'netflix', 'abrir netflix', 'abra netflix', 'abre netflix'
        ];
        if (netflixKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://www.netflix.com', 'Netflix', 'Abrindo Netflix para você!');
        }
        
        // Comandos do Spotify
        const spotifyKeywords = [
            'spotify', 'abrir spotify', 'abra spotify', 'abre spotify', 'música'
        ];
        if (spotifyKeywords.some(keyword => msg.includes(keyword))) {
            return openSite('https://open.spotify.com', 'Spotify', 'Abrindo Spotify para você!');
        }
        
        // Comandos de configuração
        const configKeywords = [
            'configurações', 'configuracao', 'config', 'settings', 'ajustes'
        ];
        
        if (configKeywords.some(keyword => msg.includes(keyword))) {
            console.log('✅ Comando de configurações detectado!');
            if (window.jarvisConfig) {
                window.jarvisConfig.showQuickSettings();
            }
            return true;
        }
        
        // Comandos de teste
        const testKeywords = [
            'teste', 'test', 'testar', 'diagnóstico', 'diagnostico'
        ];
        
        if (testKeywords.some(keyword => msg.includes(keyword))) {
            console.log('✅ Comando de teste detectado!');
            $("#WishMessage").text("Executando diagnóstico do sistema...");
            
            if (window.jarvisConfig) {
                window.jarvisConfig.diagnose().then(diagnosis => {
                    const status = diagnosis.apiConnectivity ? 'Sistema funcionando normalmente' : 'Problemas de conectividade detectados';
                    $("#WishMessage").text(status);
                    
                    if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                        window.jarvisTTS.speak(status);
                    }
                });
            }
            
            setTimeout(() => {
                $("#WishMessage").text("Pergunte-me qualquer coisa");
            }, 5000);
            return true;
        }
        
        return false;
    }
    
    async function sendToAPI(message) {
        const config = window.jarvisConfig;
        const apiUrl = config.getApiUrl();
        
        console.log('🌐 Enviando para API:', apiUrl);
        
        try {
            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_id: 'github_pages_user',
                    session_id: 'github_pages_session'
                }),
                timeout: config.settings.apiTimeout
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.response) {
                return data.response;
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error('Resposta inválida da API');
            }
            
        } catch (error) {
            console.error('❌ Erro na API:', error);
            
            // Respostas de fallback para GitHub Pages
            const fallbackResponses = [
                "Desculpe, estou com problemas de conectividade no momento. Tente novamente em alguns instantes.",
                "Não consegui processar sua solicitação agora. Verifique sua conexão com a internet.",
                "Sistema temporariamente indisponível. Por favor, tente novamente mais tarde.",
                "Erro de comunicação com o servidor. Tentando reconectar..."
            ];
            
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            
            // Se for erro de rede, tentar URL alternativa
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log('🔄 Tentando URL alternativa...');
                try {
                    const fallbackUrl = config.API_URLS.fallback;
                    const fallbackResponse = await fetch(`${fallbackUrl}/chat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: message,
                            user_id: 'github_pages_user',
                            session_id: 'github_pages_session'
                        }),
                        timeout: 15000
                    });
                    
                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        if (fallbackData.response) {
                            console.log('✅ Resposta obtida via URL alternativa');
                            return fallbackData.response;
                        }
                    }
                } catch (fallbackError) {
                    console.error('❌ Erro também na URL alternativa:', fallbackError);
                }
            }
            
            throw new Error(randomResponse);
        }
    }
    
    // Função global para configurações (compatibilidade)
    window.showJarvisSettings = function() {
        if (window.jarvisConfig) {
            window.jarvisConfig.showQuickSettings();
        }
    };
    
    // Função global para handler de configurações (compatibilidade)
    window.jarvisSettingsHandler = function(choice) {
        const config = window.jarvisConfig;
        
        switch(choice) {
            case '1':
                config.configureApiUrl();
                break;
            case '2':
                config.testConnectivity();
                break;
            case '3':
                $("#WishMessage").text("Teste: Olá! Eu sou o Jarvis funcionando no GitHub Pages!");
                if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                    window.jarvisTTS.speak("Teste: Olá! Eu sou o Jarvis funcionando no GitHub Pages!");
                }
                setTimeout(() => {
                    $("#WishMessage").text("Pergunte-me qualquer coisa");
                }, 5000);
                break;
            case '6':
                console.log('📊 Logs do console exibidos');
                alert('📊 Verifique o console do navegador (F12) para ver os logs detalhados do sistema.');
                break;
        }
    };
    
    console.log('🎯 Main GitHub Pages script carregado com sucesso!');
});
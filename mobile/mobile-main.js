/**
 * JARVIS Mobile Main Script
 * Versão mobile adaptada mantendo todas as funcionalidades da versão PC
 */

// Tornar a função disponível globalmente
window.initializeJarvisMobile = function() {
    console.log('🤖 Inicializando Jarvis Mobile...');
    
    // Verificar se jQuery está disponível
    if (typeof $ === 'undefined') {
        console.error('❌ jQuery não está disponível');
        return;
    }
    
    // Inicializar com tratamento de erro
    try {
        startJarvisMobileInit();
    } catch (error) {
        console.error('❌ Erro na inicialização mobile:', error);
        // Tentar inicialização básica
        basicMobileInit();
    }
};

$(document).ready(function () {
    console.log('📱 JARVIS Mobile DOM pronto...');
    
    // Aguardar um pouco para garantir que outros scripts carreguem
    setTimeout(() => {
        if (typeof window.initializeJarvisMobile === 'function') {
            window.initializeJarvisMobile();
        }
    }, 500);
    
    function startJarvisMobileInit() {
        initializeJarvisMobile();
    }
    
    function basicMobileInit() {
        console.log('🔄 Inicialização básica mobile...');
        
        // Remover loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Mostrar interface principal
        const startSection = document.getElementById('Start');
        const ovalSection = document.getElementById('Oval');
        
        if (startSection) startSection.hidden = true;
        if (ovalSection) {
            ovalSection.hidden = false;
            ovalSection.style.display = 'flex';
        }
        
        console.log('✅ Inicialização básica mobile concluída');
    }
    
    function initializeJarvisMobile() {
        console.log('🤖 Executando inicialização completa mobile...');
        
        // Timeout de segurança para remover loading
        const safetyTimeout = setTimeout(() => {
            console.warn('⚠️ Timeout de segurança - forçando remoção do loading');
            forceRemoveLoading();
        }, 5000);
        
        // Esconder tela de loading inicial
        setTimeout(() => {
            clearTimeout(safetyTimeout);
            
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    console.log('✅ Loading screen removido');
                    
                    // Mostra a seção de início para que as animações possam começar
                    $('#Start').attr('hidden', false);
                    // Inicia a sequência de startup
                    startMobileSequence();
                }, 500);
            } else {
                console.log('ℹ️ Loading screen não encontrado, iniciando sequência diretamente');
                // Caso a tela de carregamento não exista, inicia a sequência diretamente
                $('#Start').attr('hidden', false);
                startMobileSequence();
            }
        }, 1000);
        
        function forceRemoveLoading() {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Ir direto para a interface principal
            $('#Start').attr('hidden', true);
            const ovalSection = $('#Oval');
            ovalSection.removeClass('hidden').attr('hidden', false);
            ovalSection.addClass('animate__animated animate__zoomIn');
            
            console.log('✅ Interface mobile forçada a aparecer');
        }
        
        // Verificar se as configurações estão disponíveis
        if (!window.jarvisConfig) {
            console.error('❌ Configurações não carregadas!');
            console.warn('⚠️ Continuando sem configurações - modo fallback mobile');
            // Criar configuração básica de fallback
            window.jarvisConfig = {
                getEnvironment: () => 'mobile-fallback',
                getApiUrl: () => 'https://jarvis-tdgt.onrender.com',
                settings: {
                    apiTimeout: 45000,
                    language: 'pt-BR',
                    debugMode: true
                },
                showQuickSettings: () => showMobileQuickActions(),
                testConnectivity: () => testMobileConnectivity(),
                testTTS: () => testMobileTTS(),
                testMicrophone: () => testMobileMicrophone(),
                diagnose: () => mobileDiagnose()
            };
        } else {
            console.log('✅ Configurações mobile carregadas com sucesso');
        }
        
        const config = window.jarvisConfig;
        console.log('🌐 Ambiente Mobile:', config.getEnvironment());
        console.log('🔗 API URL:', config.getApiUrl());
        
        // Configurar animações de texto (com fallback mobile)
        setupMobileTextAnimations();
        
        // Configurar SiriWave para mobile
        setupMobileSiriWave();
        
        // Configurar event listeners mobile
        setupMobileEventListeners();
        
        // Configurar gestos mobile
        setupMobileGestures();
        
        console.log('✅ Jarvis Mobile inicializado com sucesso!');
        
        // Timeout final de segurança
        setTimeout(() => {
            const ovalSection = $('#Oval');
            if (!ovalSection.is(':visible')) {
                console.warn('🚨 Interface ainda não visível - aplicando correção final');
                forceShowMobileInterface();
            }
        }, 10000);
    }
    
    function startMobileSequence() {
        console.log('🚀 Iniciando sequência mobile...');
        
        // Timeout de segurança para garantir que a interface apareça
        const emergencyTimeout = setTimeout(() => {
            console.warn('🚨 TIMEOUT DE EMERGÊNCIA - Forçando interface mobile');
            forceShowMobileInterface();
        }, 8000);

        // Sequência de inicialização mobile otimizada
        setTimeout(() => {
            console.log('👤 Iniciando Face Auth Mobile...');
            $(\"#Loader\").attr(\"hidden\", true);
            $(\"#FaceAuth\").attr(\"hidden\", false);
            $(\"#WishMessage\").text(\"Autenticando...\");
        }, 1000);
        
        setTimeout(() => {
            console.log('✅ Face Auth Success Mobile...');
            $(\"#FaceAuth\").attr(\"hidden\", true);
            $(\"#FaceAuthSuccess\").attr(\"hidden\", false);
            $(\"#WishMessage\").text(\"Autenticação bem-sucedida!\");
        }, 2500);
        
        setTimeout(() => {
            console.log('👋 Hello Greet Mobile...');
            $(\"#FaceAuthSuccess\").attr(\"hidden\", true);
            $(\"#HelloGreet\").attr(\"hidden\", false);
            $(\"#WishMessage\").text(\"Olá, bem-vindo!\");
        }, 4000);
        
        setTimeout(() => {
            clearTimeout(emergencyTimeout);
            console.log('🎯 Carregando interface mobile...');
            
            showMobileMainInterface();
        }, 5500);
    }
    
    function showMobileMainInterface() {
        // Esconder seção Start
        $(\"#Start\").attr(\"hidden\", true);
        console.log('✅ Seção Start escondida');
        
        // Mostrar seção Oval (HUD Mobile)
        const ovalSection = $(\"#Oval\");
        ovalSection.removeClass(\"hidden\").attr(\"hidden\", false);
        ovalSection.addClass(\"animate__animated animate__zoomIn\");
        ovalSection.show();
        ovalSection.css('display', 'flex');
        console.log('✅ Seção Oval Mobile (HUD) mostrada');
        
        // Debug: verificar se a seção está visível
        setTimeout(() => {
            const isVisible = ovalSection.is(':visible');
            const display = ovalSection.css('display');
            console.log(`🔍 Oval Mobile visível: ${isVisible}, display: ${display}`);
            
            // Forçar visibilidade se necessário
            if (!isVisible) {
                console.warn('⚠️ Forçando visibilidade da seção Oval Mobile');
                forceShowMobileInterface();
            }
        }, 1000);
        
        // Atualizar mensagem
        $('.mobile-main-message').text(\"Pergunte-me qualquer coisa\");
        console.log('✅ Mensagem mobile atualizada');
        
        // Preparar mensagem de boas-vindas mobile
        setTimeout(() => {
            if (window.jarvisTTS && window.jarvisTTS.speak) {
                window.jarvisTTS.queueMessage = 'Olá! JARVIS Mobile pronto para ajudar!';
                console.log('🎤 Mensagem mobile preparada para falar após interação do usuário');
            }
        }, 1000);
    }
    
    function forceShowMobileInterface() {
        console.log('💪 Forçando exibição da interface mobile...');
        
        // Esconder todas as seções de loading/startup
        $('#loadingScreen').hide();
        $('#Start').attr('hidden', true).hide();
        
        // Mostrar interface principal
        const ovalSection = $('#Oval');
        ovalSection.attr('hidden', false);
        ovalSection.removeClass('hidden');
        ovalSection.show();
        ovalSection.css({
            'display': 'flex',
            'visibility': 'visible',
            'opacity': '1'
        });
        
        // Garantir que os elementos internos estejam visíveis
        $('.mobile-hud').show();
        $('.mobile-animation-area').show();
        $('.mobile-message-area').show();
        $('.mobile-input-container').show();
        
        console.log('✅ Interface mobile forçada com sucesso');
    }\n    \n    function setupMobileTextAnimations() {\n        // Verificar se textillate está disponível\n        if (typeof $.fn.textillate === 'function') {\n            try {\n                $('.mobile-main-message').textillate({\n                    loop: false,\n                    sync: true,\n                    in: {\n                        effect: \"fadeInUp\",\n                        delay: 50\n                    }\n                });\n\n                $('.mobile-siri-message').textillate({\n                    loop: false,\n                    sync: true,\n                    in: {\n                        effect: \"fadeInUp\",\n                        delay: 30\n                    }\n                });\n                console.log('🎨 Animações de texto mobile configuradas com textillate');\n            } catch (error) {\n                console.warn('⚠️ Erro ao configurar textillate mobile:', error);\n                setupMobileFallbackAnimations();\n            }\n        } else {\n            console.warn('⚠️ Textillate não disponível, usando animações CSS mobile');\n            setupMobileFallbackAnimations();\n        }\n    }\n    \n    function setupMobileFallbackAnimations() {\n        // Fallback para animações CSS simples mobile\n        $('.mobile-main-message, .mobile-siri-message').addClass('animate__animated animate__fadeInUp');\n        console.log('🎨 Animações CSS mobile básicas configuradas');\n    }\n    \n    let mobileSiriWave = null;\n    \n    function setupMobileSiriWave() {\n        const container = document.getElementById(\"siri-container\");\n        if (!container) {\n            console.warn('⚠️ Container siri-container mobile não encontrado');\n            return;\n        }\n        \n        // Verificar se SiriWave está disponível\n        if (typeof SiriWave === 'undefined') {\n            console.warn('⚠️ SiriWave não disponível para mobile');\n            // Criar placeholder visual simples para mobile\n            container.innerHTML = '<div style=\"width: 100%; height: 80px; background: linear-gradient(45deg, #00AAFF, #0066CC); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;\">🌊 Visualizador Mobile</div>';\n            return;\n        }\n        \n        try {\n            mobileSiriWave = new SiriWave({\n                container: container,\n                width: container.clientWidth || 280,\n                height: 80,\n                style: \"ios9\",\n                amplitude: 0.8,\n                speed: 0.25,\n                frequency: 4,\n                color: \"#00AAFF\",\n                autostart: false\n            });\n            \n            // Configurar redimensionamento responsivo mobile\n            window.addEventListener('resize', function() {\n                if (mobileSiriWave && mobileSiriWave.canvas) {\n                    try {\n                        const newWidth = container.clientWidth || 280;\n                        mobileSiriWave.canvas.style.width = newWidth + 'px';\n                    } catch (resizeError) {\n                        console.warn('⚠️ Erro ao redimensionar SiriWave mobile:', resizeError);\n                    }\n                }\n            });\n            \n            console.log('🌊 SiriWave mobile configurado com sucesso');\n        } catch (error) {\n            console.error('⚠️ Erro ao configurar SiriWave mobile:', error);\n            // Fallback: criar um placeholder visual simples\n            container.innerHTML = '<div style=\"width: 100%; height: 80px; background: linear-gradient(45deg, #00AAFF, #0066CC); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;\">🌊 Visualizador Mobile</div>';\n        }\n    }\n    \n    function setupMobileEventListeners() {\n        console.log('🔌 Configurando event listeners mobile...');\n        \n        // Debug: verificar se os botões existem\n        const buttons = ['MicBtn', 'SendBtn', 'ChatBtn', 'SettingsBtn'];\n        buttons.forEach(btnId => {\n            const btn = document.getElementById(btnId);\n            console.log(`🔍 Botão Mobile ${btnId}:`, btn ? '✅ Encontrado' : '❌ Não encontrado');\n            if (btn) {\n                const styles = getComputedStyle(btn);\n                console.log(`   - Display: ${styles.display}, Visibility: ${styles.visibility}`);\n            }\n        });\n        \n        // Listener para ativar TTS após primeira interação mobile\n        let firstInteraction = true;\n        function activateMobileTTSOnFirstInteraction() {\n            if (firstInteraction && window.jarvisTTS && window.jarvisTTS.queueMessage) {\n                firstInteraction = false;\n                setTimeout(() => {\n                    window.jarvisTTS.speak(window.jarvisTTS.queueMessage);\n                    window.jarvisTTS.queueMessage = null;\n                    console.log('🎤 Mensagem mobile de boas-vindas ativada após interação');\n                }, 500);\n            }\n        }\n        \n        // Adicionar listeners para primeira interação mobile\n        document.addEventListener('click', activateMobileTTSOnFirstInteraction, { once: true });\n        document.addEventListener('touchstart', activateMobileTTSOnFirstInteraction, { once: true });\n        \n        // Botão do microfone mobile\n        const micBtn = $(\"#MicBtn\");\n        if (micBtn.length > 0) {\n            micBtn.on('click touchend', function (e) {\n                e.preventDefault();\n                console.log('🎤 Botão de microfone mobile clicado');\n                startMobileSpeechRecognition();\n            });\n            console.log('✅ Event listener do MicBtn mobile configurado');\n        } else {\n            console.error('❌ MicBtn mobile não encontrado para configurar event listener');\n        }\n        \n        // Botão de envio mobile\n        const sendBtn = $(\"#SendBtn\");\n        if (sendBtn.length > 0) {\n            sendBtn.on('click touchend', function (e) {\n                e.preventDefault();\n                const message = $(\"#chatbox\").val().trim();\n                if (message) {\n                    sendMobileMessage(message);\n                }\n            });\n            console.log('✅ Event listener do SendBtn mobile configurado');\n        } else {\n            console.error('❌ SendBtn mobile não encontrado para configurar event listener');\n        }\n        \n        // Campo de texto mobile\n        $(\"#chatbox\").on('input', function () {\n            const message = $(\"#chatbox\").val();\n            toggleMobileSendButton(message);\n        });\n        \n        $(\"#chatbox\").on('keypress', function (e) {\n            if (e.which === 13) { // Enter\n                e.preventDefault();\n                const message = $(\"#chatbox\").val().trim();\n                if (message) {\n                    sendMobileMessage(message);\n                }\n            }\n        });\n        \n        // Botão de configurações mobile\n        const settingsBtn = $(\"#SettingsBtn\");\n        if (settingsBtn.length > 0) {\n            settingsBtn.on('click touchend', function (e) {\n                e.preventDefault();\n                if (window.jarvisConfig) {\n                    window.jarvisConfig.showQuickSettings();\n                }\n            });\n            console.log('✅ Event listener do SettingsBtn mobile configurado');\n        } else {\n            console.error('❌ SettingsBtn mobile não encontrado para configurar event listener');\n        }\n        \n        // Botão do chat mobile\n        const chatBtn = $(\"#ChatBtn\");\n        if (chatBtn.length > 0) {\n            chatBtn.on('click touchend', function (e) {\n                e.preventDefault();\n                console.log('💬 Botão de chat mobile clicado');\n                toggleMobileChatCanvas();\n            });\n            console.log('✅ Event listener do ChatBtn mobile configurado');\n        } else {\n            console.error('❌ ChatBtn mobile não encontrado para configurar event listener');\n        }\n    }\n    \n    function setupMobileGestures() {\n        console.log('👆 Configurando gestos mobile...');\n        \n        let touchStartY = 0;\n        let touchStartX = 0;\n        \n        // Swipe gestures\n        document.addEventListener('touchstart', function(e) {\n            touchStartY = e.touches[0].clientY;\n            touchStartX = e.touches[0].clientX;\n        }, { passive: true });\n        \n        document.addEventListener('touchend', function(e) {\n            if (!touchStartY || !touchStartX) return;\n            \n            const touchEndY = e.changedTouches[0].clientY;\n            const touchEndX = e.changedTouches[0].clientX;\n            \n            const diffY = touchStartY - touchEndY;\n            const diffX = touchStartX - touchEndX;\n            \n            // Swipe up para ativar microfone\n            if (Math.abs(diffY) > Math.abs(diffX) && diffY > 50) {\n                console.log('👆 Swipe up detectado - ativando microfone');\n                startMobileSpeechRecognition();\n            }\n            \n            // Swipe down para abrir chat\n            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -50) {\n                console.log('👇 Swipe down detectado - abrindo chat');\n                toggleMobileChatCanvas();\n            }\n            \n            touchStartY = 0;\n            touchStartX = 0;\n        }, { passive: true });\n        \n        // Long press para configurações\n        let longPressTimer;\n        document.addEventListener('touchstart', function(e) {\n            longPressTimer = setTimeout(() => {\n                console.log('👆 Long press detectado - abrindo configurações');\n                if (window.jarvisConfig) {\n                    window.jarvisConfig.showQuickSettings();\n                }\n                // Vibração se disponível\n                if (navigator.vibrate) {\n                    navigator.vibrate(100);\n                }\n            }, 1000);\n        }, { passive: true });\n        \n        document.addEventListener('touchend', function() {\n            clearTimeout(longPressTimer);\n        }, { passive: true });\n        \n        console.log('✅ Gestos mobile configurados');\n    }\n    \n    function toggleMobileSendButton(message) {\n        if (message.length === 0) {\n            $(\"#MicBtn\").attr('hidden', false);\n            $(\"#SendBtn\").attr('hidden', true);\n        } else {\n            $(\"#MicBtn\").attr('hidden', true);\n            $(\"#SendBtn\").attr('hidden', false);\n        }\n    }\n    \n    function startMobileSpeechRecognition() {\n        console.log('🎤 Iniciando reconhecimento de voz mobile...');\n        \n        // Verificar se o sistema de reconhecimento está disponível\n        if (!window.jarvisSpeechRecognition || !window.jarvisSpeechRecognition.isAvailable()) {\n            console.warn('⚠️ Sistema de reconhecimento de voz não disponível no mobile');\n            showMobileToast(\"Reconhecimento de voz não disponível. Use o campo de texto.\");\n            return;\n        }\n        \n        const speechRecognition = window.jarvisSpeechRecognition;\n        \n        // Se já está ativo, parar\n        if (speechRecognition.isActive()) {\n            console.log('🛑 Parando reconhecimento mobile ativo...');\n            speechRecognition.stop();\n            resetMobileInterface();\n            return;\n        }\n        \n        // Mostrar interface de escuta mobile\n        $(\"#Oval\").attr(\"hidden\", true);\n        $(\"#SiriWave\").attr(\"hidden\", false);\n        \n        // Configurar callbacks mobile\n        speechRecognition.onStart(() => {\n            console.log('🎤 Reconhecimento mobile iniciado');\n            \n            // Ativar SiriWave mobile\n            if (mobileSiriWave) {\n                mobileSiriWave.start();\n            }\n            \n            // Atualizar visual do botão mobile\n            $('#MicBtn').addClass('recording');\n            $('.mobile-siri-message').text(\"Escutando... Fale agora!\");\n            \n            // Vibração se disponível\n            if (navigator.vibrate) {\n                navigator.vibrate(50);\n            }\n        });\n        \n        speechRecognition.onInterim((transcript) => {\n            console.log('⏳ Transcrição mobile parcial:', transcript);\n            $('.mobile-siri-message').text(`Ouvindo: \"${transcript}\"`);\n        });\n        \n        speechRecognition.onResult((transcript, confidence) => {\n            console.log('✅ Transcrição mobile final:', transcript);\n            console.log('🎯 Confiança:', (confidence * 100).toFixed(1) + '%');\n            \n            if (transcript.trim()) {\n                $(\"#chatbox\").val(transcript);\n                $('.mobile-siri-message').text(`Processando: \"${transcript}\"`);\n                \n                // Vibração de sucesso\n                if (navigator.vibrate) {\n                    navigator.vibrate([50, 100, 50]);\n                }\n                \n                // Processar comando automaticamente\n                setTimeout(() => {\n                    sendMobileMessage(transcript);\n                }, 500);\n            }\n        });\n        \n        speechRecognition.onError((error, message) => {\n            console.error('❌ Erro no reconhecimento mobile:', error, message);\n            showMobileToast(`Erro: ${message}`);\n            resetMobileInterface();\n            \n            // Voltar para interface principal após erro\n            setTimeout(() => {\n                $(\"#SiriWave\").attr(\"hidden\", true);\n                $(\"#Oval\").attr(\"hidden\", false);\n                $('.mobile-main-message').text(\"Pergunte-me qualquer coisa\");\n            }, 3000);\n        });\n        \n        speechRecognition.onEnd(() => {\n            console.log('🛑 Reconhecimento mobile finalizado');\n            resetMobileInterface();\n        });\n        \n        // Iniciar reconhecimento\n        const started = speechRecognition.start();\n        if (!started) {\n            console.error('❌ Falha ao iniciar reconhecimento mobile');\n            resetMobileInterface();\n        }\n    }\n    \n    function resetMobileInterface() {\n        $('#MicBtn').removeClass('recording');\n        \n        // Parar SiriWave mobile\n        if (mobileSiriWave) {\n            mobileSiriWave.stop();\n        }\n    }\n    \n    function sendMobileMessage(message) {\n        if (!message || !message.trim()) {\n            return;\n        }\n        \n        console.log('📤 Enviando mensagem mobile:', message);\n        \n        // Adicionar mensagem do usuário ao chat mobile\n        addMobileMessageToChat(message, 'user');\n        \n        // Verificar comandos locais primeiro\n        if (handleMobileLocalCommands(message)) {\n            return;\n        }\n        \n        // Mostrar interface de processamento mobile\n        $(\"#Oval\").attr(\"hidden\", true);\n        $(\"#SiriWave\").attr(\"hidden\", false);\n        \n        // Ativar SiriWave mobile\n        if (mobileSiriWave) {\n            mobileSiriWave.start();\n        }\n        \n        $('.mobile-siri-message').text(\"Processando sua mensagem...\");\n        \n        // Enviar para API\n        sendMobileToAPI(message)\n            .then(response => {\n                console.log('✅ Resposta mobile recebida:', response);\n                $('.mobile-siri-message').text(response);\n                \n                // Adicionar resposta do JARVIS ao chat mobile\n                addMobileMessageToChat(response, 'jarvis');\n                \n                // Falar resposta se TTS estiver ativo\n                if (window.jarvisTTS && window.jarvisTTS.isEnabled) {\n                    window.jarvisTTS.speak(response);\n                }\n                \n                // Vibração de sucesso\n                if (navigator.vibrate) {\n                    navigator.vibrate([100, 50, 100]);\n                }\n            })\n            .catch(error => {\n                console.error('❌ Erro na API mobile:', error);\n                $('.mobile-siri-message').text(`Erro: ${error.message}`);\n                showMobileToast(`Erro: ${error.message}`);\n            })\n            .finally(() => {\n                // Parar SiriWave mobile\n                if (mobileSiriWave) {\n                    mobileSiriWave.stop();\n                }\n                \n                // Limpar input e resetar botões\n                $(\"#chatbox\").val(\"\");\n                $(\"#MicBtn\").attr('hidden', false);\n                $(\"#SendBtn\").attr('hidden', true);\n                \n                // Voltar para a tela principal após 4 segundos\n                setTimeout(() => {\n                    $(\"#SiriWave\").attr(\"hidden\", true);\n                    $(\"#Oval\").attr(\"hidden\", false);\n                    $('.mobile-main-message').text(\"Pergunte-me qualquer coisa\");\n                }, 4000);\n            });\n    }\n    \n    function handleMobileLocalCommands(message) {\n        const msg = message.toLowerCase().trim();\n        console.log('🔍 Verificando comando local mobile:', msg);\n        \n        // Função auxiliar para abrir sites mobile\n        function openMobileSite(url, siteName, message) {\n            console.log(`✅ Comando mobile ${siteName} detectado!`);\n            window.open(url, '_blank');\n            showMobileToast(message);\n            \n            if (window.jarvisTTS && window.jarvisTTS.isEnabled) {\n                window.jarvisTTS.speak(message);\n            }\n            \n            return true;\n        }\n        \n        // Comandos específicos mobile\n        const mobileCommands = {\n            whatsapp: () => openMobileSite('https://web.whatsapp.com', 'WhatsApp', 'Abrindo WhatsApp!'),\n            youtube: () => openMobileSite('https://m.youtube.com', 'YouTube', 'Abrindo YouTube Mobile!'),\n            google: () => openMobileSite('https://www.google.com', 'Google', 'Abrindo Google!'),\n            gmail: () => openMobileSite('https://mail.google.com', 'Gmail', 'Abrindo Gmail!'),\n            facebook: () => openMobileSite('https://m.facebook.com', 'Facebook', 'Abrindo Facebook Mobile!'),\n            instagram: () => openMobileSite('https://www.instagram.com', 'Instagram', 'Abrindo Instagram!'),\n            twitter: () => openMobileSite('https://mobile.twitter.com', 'Twitter', 'Abrindo Twitter Mobile!'),\n            configurações: () => {\n                console.log('✅ Comando de configurações mobile detectado!');\n                if (window.jarvisConfig) {\n                    window.jarvisConfig.showQuickSettings();\n                }\n                return true;\n            },\n            teste: () => {\n                console.log('✅ Comando de teste mobile detectado!');\n                showMobileToast(\"Executando diagnóstico mobile...\");\n                \n                if (window.jarvisConfig) {\n                    window.jarvisConfig.diagnose().then(diagnosis => {\n                        const status = diagnosis.apiConnectivity ? 'Sistema mobile funcionando normalmente' : 'Problemas de conectividade detectados';\n                        showMobileToast(status);\n                        \n                        if (window.jarvisTTS && window.jarvisTTS.isEnabled) {\n                            window.jarvisTTS.speak(status);\n                        }\n                    });\n                }\n                return true;\n            }\n        };\n        \n        // Verificar comandos\n        for (const [keyword, action] of Object.entries(mobileCommands)) {\n            if (msg.includes(keyword)) {\n                return action();\n            }\n        }\n        \n        return false;\n    }\n    \n    async function sendMobileToAPI(message) {\n        const config = window.jarvisConfig;\n        const apiUrl = config.getApiUrl();\n        \n        console.log('🌐 Enviando para API mobile:', apiUrl);\n        \n        try {\n            const response = await fetch(`${apiUrl}/chat`, {\n                method: 'POST',\n                headers: {\n                    'Content-Type': 'application/json',\n                },\n                body: JSON.stringify({\n                    message: message,\n                    user_id: 'mobile_user',\n                    session_id: 'mobile_session',\n                    platform: 'mobile'\n                }),\n                timeout: config.settings.apiTimeout\n            });\n            \n            if (!response.ok) {\n                throw new Error(`API Error: ${response.status} ${response.statusText}`);\n            }\n            \n            const data = await response.json();\n            \n            if (data.response) {\n                return data.response;\n            } else if (data.error) {\n                throw new Error(data.error);\n            } else {\n                throw new Error('Resposta inválida da API');\n            }\n            \n        } catch (error) {\n            console.error('❌ Erro na API mobile:', error);\n            \n            // Respostas de fallback para mobile\n            const mobileFallbackResponses = [\n                \"Desculpe, estou com problemas de conectividade no momento. Tente novamente.\",\n                \"Não consegui processar sua solicitação agora. Verifique sua conexão.\",\n                \"Sistema temporariamente indisponível. Tente novamente mais tarde.\",\n                \"Erro de comunicação com o servidor mobile.\"\n            ];\n            \n            const randomResponse = mobileFallbackResponses[Math.floor(Math.random() * mobileFallbackResponses.length)];\n            throw new Error(randomResponse);\n        }\n    }\n    \n    // ===== FUNÇÕES DO CHAT MOBILE =====\n    \n    let mobileChatHistory = [];\n    let mobileChatVisible = false;\n    \n    function toggleMobileChatCanvas() {\n        const chatCanvas = document.getElementById('mobileChat');\n        if (!chatCanvas) {\n            console.warn('⚠️ Chat canvas mobile não encontrado');\n            return;\n        }\n        \n        if (mobileChatVisible) {\n            // Fechar chat mobile\n            $(chatCanvas).offcanvas('hide');\n            mobileChatVisible = false;\n            console.log('💬 Chat mobile fechado');\n        } else {\n            // Abrir chat mobile e carregar histórico\n            loadMobileChatHistory();\n            $(chatCanvas).offcanvas('show');\n            mobileChatVisible = true;\n            console.log('💬 Chat mobile aberto');\n        }\n    }\n    \n    function addMobileMessageToChat(message, sender) {\n        const timestamp = new Date().toLocaleTimeString('pt-BR', {\n            hour: '2-digit',\n            minute: '2-digit'\n        });\n        \n        const chatMessage = {\n            id: Date.now(),\n            message: message,\n            sender: sender, // 'user' ou 'jarvis'\n            timestamp: timestamp,\n            time: new Date()\n        };\n        \n        mobileChatHistory.push(chatMessage);\n        \n        // Limitar histórico a 50 mensagens\n        if (mobileChatHistory.length > 50) {\n            mobileChatHistory = mobileChatHistory.slice(-50);\n        }\n        \n        console.log('💬 Mensagem mobile adicionada ao chat:', chatMessage);\n        \n        // Atualizar interface se chat estiver visível\n        if (mobileChatVisible) {\n            loadMobileChatHistory();\n        }\n        \n        // Salvar no localStorage\n        saveMobileChatHistory();\n    }\n    \n    function loadMobileChatHistory() {\n        const chatBody = document.getElementById('mobile-chat-body');\n        if (!chatBody) {\n            console.warn('⚠️ Chat body mobile não encontrado');\n            return;\n        }\n        \n        // Carregar histórico do localStorage\n        loadMobileChatFromStorage();\n        \n        if (mobileChatHistory.length === 0) {\n            chatBody.innerHTML = `\n                <div class=\"text-center text-light p-4\">\n                    <i class=\"bi bi-chat-dots\" style=\"font-size: 3rem; opacity: 0.5;\"></i>\n                    <p class=\"mt-3 mb-0\">Nenhuma conversa ainda</p>\n                    <small class=\"text-muted\">Comece digitando uma mensagem</small>\n                </div>\n            `;\n            return;\n        }\n        \n        let chatHTML = '';\n        \n        mobileChatHistory.forEach(msg => {\n            const isUser = msg.sender === 'user';\n            const messageClass = isUser ? 'sender_message' : 'receiver_message';\n            const alignClass = isUser ? 'ms-auto' : 'me-auto';\n            \n            chatHTML += `\n                <div class=\"d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}\">\n                    <div class=\"${messageClass}\" style=\"max-width: 85%;\">\n                        <div class=\"message-content\">\n                            ${escapeHtml(msg.message)}\n                        </div>\n                        <div class=\"message-time\">\n                            ${msg.timestamp}\n                        </div>\n                    </div>\n                </div>\n            `;\n        });\n        \n        chatBody.innerHTML = chatHTML;\n        \n        // Scroll para a última mensagem\n        setTimeout(() => {\n            chatBody.scrollTop = chatBody.scrollHeight;\n        }, 100);\n    }\n    \n    function saveMobileChatHistory() {\n        try {\n            localStorage.setItem('jarvis_mobile_chat_history', JSON.stringify(mobileChatHistory));\n        } catch (error) {\n            console.warn('⚠️ Erro ao salvar histórico do chat mobile:', error);\n        }\n    }\n    \n    function loadMobileChatFromStorage() {\n        try {\n            const saved = localStorage.getItem('jarvis_mobile_chat_history');\n            if (saved) {\n                mobileChatHistory = JSON.parse(saved);\n            }\n        } catch (error) {\n            console.warn('⚠️ Erro ao carregar histórico do chat mobile:', error);\n            mobileChatHistory = [];\n        }\n    }\n    \n    function clearMobileChatHistory() {\n        mobileChatHistory = [];\n        saveMobileChatHistory();\n        loadMobileChatHistory();\n        console.log('💬 Histórico do chat mobile limpo');\n        showMobileToast('Histórico limpo');\n    }\n    \n    function escapeHtml(text) {\n        const div = document.createElement('div');\n        div.textContent = text;\n        return div.innerHTML;\n    }\n    \n    // ===== FUNÇÕES AUXILIARES MOBILE =====\n    \n    function showMobileToast(message, duration = 3000) {\n        // Criar toast mobile\n        const toast = document.createElement('div');\n        toast.className = 'mobile-toast';\n        toast.textContent = message;\n        toast.style.cssText = `\n            position: fixed;\n            top: 20px;\n            left: 50%;\n            transform: translateX(-50%);\n            background: rgba(0, 170, 255, 0.9);\n            color: white;\n            padding: 12px 20px;\n            border-radius: 25px;\n            z-index: 10000;\n            font-size: 14px;\n            backdrop-filter: blur(10px);\n            border: 1px solid rgba(255, 255, 255, 0.2);\n            animation: mobileToastIn 0.3s ease;\n        `;\n        \n        document.body.appendChild(toast);\n        \n        setTimeout(() => {\n            toast.style.animation = 'mobileToastOut 0.3s ease';\n            setTimeout(() => {\n                document.body.removeChild(toast);\n            }, 300);\n        }, duration);\n    }\n    \n    function showMobileQuickActions() {\n        const quickActions = document.getElementById('mobileQuickActions');\n        if (quickActions) {\n            quickActions.hidden = !quickActions.hidden;\n            console.log('⚡ Quick actions mobile toggled');\n        }\n    }\n    \n    function testMobileConnectivity() {\n        showMobileToast('Testando conectividade mobile...');\n        if (window.jarvisConfig && window.jarvisConfig.testConnectivity) {\n            window.jarvisConfig.testConnectivity();\n        }\n    }\n    \n    function testMobileTTS() {\n        showMobileToast('Testando voz mobile...');\n        if (window.jarvisConfig && window.jarvisConfig.testTTS) {\n            window.jarvisConfig.testTTS();\n        }\n    }\n    \n    function testMobileMicrophone() {\n        showMobileToast('Testando microfone mobile...');\n        if (window.jarvisConfig && window.jarvisConfig.testMicrophone) {\n            window.jarvisConfig.testMicrophone();\n        }\n    }\n    \n    async function mobileDiagnose() {\n        showMobileToast('Executando diagnóstico mobile...');\n        \n        const diagnosis = {\n            environment: 'mobile',\n            platform: navigator.platform,\n            userAgent: navigator.userAgent,\n            online: navigator.onLine,\n            connection: navigator.connection ? navigator.connection.effectiveType : 'unknown',\n            battery: navigator.getBattery ? await navigator.getBattery() : null,\n            timestamp: new Date().toISOString()\n        };\n        \n        console.log('📊 Diagnóstico mobile completo:', diagnosis);\n        return diagnosis;\n    }\n    \n    // Expor funções globalmente para uso em outros scripts mobile\n    window.jarvisMobileChat = {\n        addMessage: addMobileMessageToChat,\n        loadHistory: loadMobileChatHistory,\n        clearHistory: clearMobileChatHistory,\n        toggle: toggleMobileChatCanvas\n    };\n    \n    window.jarvisMobile = {\n        showToast: showMobileToast,\n        showQuickActions: showMobileQuickActions,\n        testConnectivity: testMobileConnectivity,\n        testTTS: testMobileTTS,\n        testMicrophone: testMobileMicrophone,\n        diagnose: mobileDiagnose\n    };\n    \n    // Carregar histórico mobile na inicialização\n    loadMobileChatFromStorage();\n    \n    console.log('🎯 JARVIS Mobile script carregado com sucesso!');\n});\n\n// Adicionar estilos de animação para toasts\nconst mobileToastStyles = document.createElement('style');\nmobileToastStyles.textContent = `\n    @keyframes mobileToastIn {\n        from {\n            opacity: 0;\n            transform: translateX(-50%) translateY(-20px);\n        }\n        to {\n            opacity: 1;\n            transform: translateX(-50%) translateY(0);\n        }\n    }\n    \n    @keyframes mobileToastOut {\n        from {\n            opacity: 1;\n            transform: translateX(-50%) translateY(0);\n        }\n        to {\n            opacity: 0;\n            transform: translateX(-50%) translateY(-20px);\n        }\n    }\n    \n    .mobile-btn.recording {\n        background: linear-gradient(45deg, #FF0000, #FF4444) !important;\n        animation: recordingPulse 1s infinite;\n    }\n    \n    @keyframes recordingPulse {\n        0%, 100% { transform: scale(1); }\n        50% { transform: scale(1.1); }\n    }\n`;\ndocument.head.appendChild(mobileToastStyles);"
/**
 * JARVIS Mobile Main Script
 * Versão mobile adaptada mantendo todas as funcionalidades da versão PC
 */

// Funções auxiliares definidas globalmente
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
        if (typeof window.initializeJarvisMobileComplete === 'function') {
            window.initializeJarvisMobileComplete();
        } else {
            console.warn('⚠️ Função de inicialização completa não encontrada, usando fallback');
            basicMobileInit();
        }
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
    
    // Definir a função de inicialização completa
    window.initializeJarvisMobileComplete = function() {
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
    };
    
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
            $("#Loader").attr("hidden", true);
            $("#FaceAuth").attr("hidden", false);
            $("#WishMessage").text("Autenticando...");
        }, 1000);
        
        setTimeout(() => {
            console.log('✅ Face Auth Success Mobile...');
            $("#FaceAuth").attr("hidden", true);
            $("#FaceAuthSuccess").attr("hidden", false);
            $("#WishMessage").text("Autenticação bem-sucedida!");
        }, 2500);
        
        setTimeout(() => {
            console.log('👋 Hello Greet Mobile...');
            $("#FaceAuthSuccess").attr("hidden", true);
            $("#HelloGreet").attr("hidden", false);
            $("#WishMessage").text("Olá, bem-vindo!");
        }, 4000);
        
        setTimeout(() => {
            clearTimeout(emergencyTimeout);
            console.log('🎯 Carregando interface mobile...');
            
            showMobileMainInterface();
        }, 5500);
    }
    
    function showMobileMainInterface() {
        // Esconder seção Start
        $("#Start").attr("hidden", true);
        console.log('✅ Seção Start escondida');
        
        // Mostrar seção Oval (HUD Mobile)
        const ovalSection = $("#Oval");
        ovalSection.removeClass("hidden").attr("hidden", false);
        ovalSection.addClass("animate__animated animate__zoomIn");
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
        $('.mobile-main-message').text("Pergunte-me qualquer coisa");
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
    }
    
    function setupMobileTextAnimations() {
        // Verificar se textillate está disponível
        if (typeof $.fn.textillate === 'function') {
            try {
                $('.mobile-main-message').textillate({
                    loop: false,
                    sync: true,
                    in: {
                        effect: "fadeInUp",
                        delay: 50
                    }
                });

                $('.mobile-siri-message').textillate({
                    loop: false,
                    sync: true,
                    in: {
                        effect: "fadeInUp",
                        delay: 30
                    }
                });
                console.log('🎨 Animações de texto mobile configuradas com textillate');
            } catch (error) {
                console.warn('⚠️ Erro ao configurar textillate mobile:', error);
                setupMobileFallbackAnimations();
            }
        } else {
            console.warn('⚠️ Textillate não disponível, usando animações CSS mobile');
            setupMobileFallbackAnimations();
        }
    }
    
    function setupMobileFallbackAnimations() {
        // Fallback para animações CSS simples mobile
        $('.mobile-main-message, .mobile-siri-message').addClass('animate__animated animate__fadeInUp');
        console.log('🎨 Animações CSS mobile básicas configuradas');
    }
    
    let mobileSiriWave = null;
    
    function setupMobileSiriWave() {
        const container = document.getElementById("siri-container");
        if (!container) {
            console.warn('⚠️ Container siri-container mobile não encontrado');
            return;
        }
        
        // Verificar se SiriWave está disponível
        if (typeof SiriWave === 'undefined') {
            console.warn('⚠️ SiriWave não disponível para mobile');
            // Criar placeholder visual simples para mobile
            container.innerHTML = '<div style="width: 100%; height: 80px; background: linear-gradient(45deg, #00AAFF, #0066CC); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">🌊 Visualizador Mobile</div>';
            return;
        }
        
        try {
            mobileSiriWave = new SiriWave({
                container: container,
                width: container.clientWidth || 280,
                height: 80,
                style: "ios9",
                amplitude: 0.8,
                speed: 0.25,
                frequency: 4,
                color: "#00AAFF",
                autostart: false
            });
            
            // Configurar redimensionamento responsivo mobile
            window.addEventListener('resize', function() {
                if (mobileSiriWave && mobileSiriWave.canvas) {
                    try {
                        const newWidth = container.clientWidth || 280;
                        mobileSiriWave.canvas.style.width = newWidth + 'px';
                    } catch (resizeError) {
                        console.warn('⚠️ Erro ao redimensionar SiriWave mobile:', resizeError);
                    }
                }
            });
            
            console.log('🌊 SiriWave mobile configurado com sucesso');
        } catch (error) {
            console.error('⚠️ Erro ao configurar SiriWave mobile:', error);
            // Fallback: criar um placeholder visual simples
            container.innerHTML = '<div style="width: 100%; height: 80px; background: linear-gradient(45deg, #00AAFF, #0066CC); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">🌊 Visualizador Mobile</div>';
        }
    }
    
    function setupMobileEventListeners() {
        console.log('🔌 Configurando event listeners mobile...');
        
        // Debug: verificar se os botões existem
        const buttons = ['MicBtn', 'SendBtn', 'ChatBtn', 'SettingsBtn'];
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            console.log(`🔍 Botão Mobile ${btnId}:`, btn ? '✅ Encontrado' : '❌ Não encontrado');
            if (btn) {
                const styles = getComputedStyle(btn);
                console.log(`   - Display: ${styles.display}, Visibility: ${styles.visibility}`);
            }
        });
        
        // Listener para ativar TTS após primeira interação mobile
        let firstInteraction = true;
        function activateMobileTTSOnFirstInteraction() {
            if (firstInteraction && window.jarvisTTS && window.jarvisTTS.queueMessage) {
                firstInteraction = false;
                setTimeout(() => {
                    window.jarvisTTS.speak(window.jarvisTTS.queueMessage);
                    window.jarvisTTS.queueMessage = null;
                    console.log('🎤 Mensagem mobile de boas-vindas ativada após interação');
                }, 500);
            }
        }
        
        // Adicionar listeners para primeira interação mobile
        document.addEventListener('click', activateMobileTTSOnFirstInteraction, { once: true });
        document.addEventListener('touchstart', activateMobileTTSOnFirstInteraction, { once: true });
        
        // Botão do microfone mobile
        const micBtn = $("#MicBtn");
        if (micBtn.length > 0) {
            micBtn.on('click touchend', function (e) {
                e.preventDefault();
                console.log('🎤 Botão de microfone mobile clicado');
                startMobileSpeechRecognition();
            });
            console.log('✅ Event listener do MicBtn mobile configurado');
        } else {
            console.error('❌ MicBtn mobile não encontrado para configurar event listener');
        }
        
        // Botão de envio mobile
        const sendBtn = $("#SendBtn");
        if (sendBtn.length > 0) {
            sendBtn.on('click touchend', function (e) {
                e.preventDefault();
                const message = $("#chatbox").val().trim();
                if (message) {
                    sendMobileMessage(message);
                }
            });
            console.log('✅ Event listener do SendBtn mobile configurado');
        } else {
            console.error('❌ SendBtn mobile não encontrado para configurar event listener');
        }
        
        // Campo de texto mobile
        $("#chatbox").on('input', function () {
            const message = $("#chatbox").val();
            toggleMobileSendButton(message);
        });
        
        $("#chatbox").on('keypress', function (e) {
            if (e.which === 13) { // Enter
                e.preventDefault();
                const message = $("#chatbox").val().trim();
                if (message) {
                    sendMobileMessage(message);
                }
            }
        });
        
        // Botão de configurações mobile
        const settingsBtn = $("#SettingsBtn");
        if (settingsBtn.length > 0) {
            settingsBtn.on('click touchend', function (e) {
                e.preventDefault();
                if (window.jarvisConfig) {
                    window.jarvisConfig.showQuickSettings();
                }
            });
            console.log('✅ Event listener do SettingsBtn mobile configurado');
        } else {
            console.error('❌ SettingsBtn mobile não encontrado para configurar event listener');
        }
        
        // Botão do chat mobile
        const chatBtn = $("#ChatBtn");
        if (chatBtn.length > 0) {
            chatBtn.on('click touchend', function (e) {
                e.preventDefault();
                console.log('💬 Botão de chat mobile clicado');
                toggleMobileChatCanvas();
            });
            console.log('✅ Event listener do ChatBtn mobile configurado');
        } else {
            console.error('❌ ChatBtn mobile não encontrado para configurar event listener');
        }
    }
    
    function setupMobileGestures() {
        console.log('👆 Configurando gestos mobile...');
        
        let touchStartY = 0;
        let touchStartX = 0;
        
        // Swipe gestures
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (!touchStartY || !touchStartX) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            
            const diffY = touchStartY - touchEndY;
            const diffX = touchStartX - touchEndX;
            
            // Swipe up para ativar microfone
            if (Math.abs(diffY) > Math.abs(diffX) && diffY > 50) {
                console.log('👆 Swipe up detectado - ativando microfone');
                startMobileSpeechRecognition();
            }
            
            // Swipe down para abrir chat
            if (Math.abs(diffY) > Math.abs(diffX) && diffY < -50) {
                console.log('👇 Swipe down detectado - abrindo chat');
                toggleMobileChatCanvas();
            }
            
            touchStartY = 0;
            touchStartX = 0;
        }, { passive: true });
        
        // Long press para configurações
        let longPressTimer;
        document.addEventListener('touchstart', function(e) {
            longPressTimer = setTimeout(() => {
                console.log('👆 Long press detectado - abrindo configurações');
                if (window.jarvisConfig) {
                    window.jarvisConfig.showQuickSettings();
                }
                // Vibração se disponível
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
            }, 1000);
        }, { passive: true });
        
        document.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        }, { passive: true });
        
        console.log('✅ Gestos mobile configurados');
    }
    
    function toggleMobileSendButton(message) {
        if (message.length === 0) {
            $("#MicBtn").attr('hidden', false);
            $("#SendBtn").attr('hidden', true);
        } else {
            $("#MicBtn").attr('hidden', true);
            $("#SendBtn").attr('hidden', false);
        }
    }
    
    function startMobileSpeechRecognition() {
        console.log('🎤 Iniciando reconhecimento de voz mobile...');
        
        // Verificar se o sistema de reconhecimento está disponível
        if (!window.jarvisSpeechRecognition || !window.jarvisSpeechRecognition.isAvailable()) {
            console.warn('⚠️ Sistema de reconhecimento de voz não disponível no mobile');
            showMobileToast("Reconhecimento de voz não disponível. Use o campo de texto.");
            return;
        }
        
        const speechRecognition = window.jarvisSpeechRecognition;
        
        // Se já está ativo, parar
        if (speechRecognition.isActive()) {
            console.log('🛑 Parando reconhecimento mobile ativo...');
            speechRecognition.stop();
            resetMobileInterface();
            return;
        }
        
        // Mostrar interface de escuta mobile
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        
        // Configurar callbacks mobile
        speechRecognition.onStart(() => {
            console.log('🎤 Reconhecimento mobile iniciado');
            
            // Ativar SiriWave mobile
            if (mobileSiriWave) {
                mobileSiriWave.start();
            }
            
            // Atualizar visual do botão mobile
            $('#MicBtn').addClass('recording');
            $('.mobile-siri-message').text("Escutando... Fale agora!");
            
            // Vibração se disponível
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
        
        speechRecognition.onInterim((transcript) => {
            console.log('⏳ Transcrição mobile parcial:', transcript);
            $('.mobile-siri-message').text(`Ouvindo: "${transcript}"`);
        });
        
        speechRecognition.onResult((transcript, confidence) => {
            console.log('✅ Transcrição mobile final:', transcript);
            console.log('🎯 Confiança:', (confidence * 100).toFixed(1) + '%');
            
            if (transcript.trim()) {
                $("#chatbox").val(transcript);
                $('.mobile-siri-message').text(`Processando: "${transcript}"`);
                
                // Vibração de sucesso
                if (navigator.vibrate) {
                    navigator.vibrate([50, 100, 50]);
                }
                
                // Processar comando automaticamente
                setTimeout(() => {
                    sendMobileMessage(transcript);
                }, 500);
            }
        });
        
        speechRecognition.onError((error, message) => {
            console.error('❌ Erro no reconhecimento mobile:', error, message);
            showMobileToast(`Erro: ${message}`);
            resetMobileInterface();
            
            // Voltar para interface principal após erro
            setTimeout(() => {
                $("#SiriWave").attr("hidden", true);
                $("#Oval").attr("hidden", false);
                $('.mobile-main-message').text("Pergunte-me qualquer coisa");
            }, 3000);
        });
        
        speechRecognition.onEnd(() => {
            console.log('🛑 Reconhecimento mobile finalizado');
            resetMobileInterface();
        });
        
        // Iniciar reconhecimento
        const started = speechRecognition.start();
        if (!started) {
            console.error('❌ Falha ao iniciar reconhecimento mobile');
            resetMobileInterface();
        }
    }
    
    function resetMobileInterface() {
        $('#MicBtn').removeClass('recording');
        
        // Parar SiriWave mobile
        if (mobileSiriWave) {
            mobileSiriWave.stop();
        }
    }
    
    function sendMobileMessage(message) {
        if (!message || !message.trim()) {
            return;
        }
        
        console.log('📤 Enviando mensagem mobile:', message);
        
        // Adicionar mensagem do usuário ao chat mobile
        addMobileMessageToChat(message, 'user');
        
        // Verificar comandos locais primeiro
        if (handleMobileLocalCommands(message)) {
            return;
        }
        
        // Mostrar interface de processamento mobile
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        
        // Ativar SiriWave mobile
        if (mobileSiriWave) {
            mobileSiriWave.start();
        }
        
        $('.mobile-siri-message').text("Processando sua mensagem...");
        
        // Enviar para API
        sendMobileToAPI(message)
            .then(response => {
                console.log('✅ Resposta mobile recebida:', response);
                $('.mobile-siri-message').text(response);
                
                // Adicionar resposta do JARVIS ao chat mobile
                addMobileMessageToChat(response, 'jarvis');
                
                // Falar resposta se TTS estiver ativo
                if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                    window.jarvisTTS.speak(response);
                }
                
                // Vibração de sucesso
                if (navigator.vibrate) {
                    navigator.vibrate([100, 50, 100]);
                }
            })
            .catch(error => {
                console.error('❌ Erro na API mobile:', error);
                $('.mobile-siri-message').text(`Erro: ${error.message}`);
                showMobileToast(`Erro: ${error.message}`);
            })
            .finally(() => {
                // Parar SiriWave mobile
                if (mobileSiriWave) {
                    mobileSiriWave.stop();
                }
                
                // Limpar input e resetar botões
                $("#chatbox").val("");
                $("#MicBtn").attr('hidden', false);
                $("#SendBtn").attr('hidden', true);
                
                // Voltar para a tela principal após 4 segundos
                setTimeout(() => {
                    $("#SiriWave").attr("hidden", true);
                    $("#Oval").attr("hidden", false);
                    $('.mobile-main-message').text("Pergunte-me qualquer coisa");
                }, 4000);
            });
    }
    
    function handleMobileLocalCommands(message) {
        const msg = message.toLowerCase().trim();
        console.log('🔍 Verificando comando local mobile:', msg);
        
        // Função auxiliar para abrir sites mobile
        function openMobileSite(url, siteName, message) {
            console.log(`✅ Comando mobile ${siteName} detectado!`);
            window.open(url, '_blank');
            showMobileToast(message);
            
            if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                window.jarvisTTS.speak(message);
            }
            
            return true;
        }
        
        // Comandos específicos mobile
        const mobileCommands = {
            whatsapp: () => openMobileSite('https://web.whatsapp.com', 'WhatsApp', 'Abrindo WhatsApp!'),
            youtube: () => openMobileSite('https://m.youtube.com', 'YouTube', 'Abrindo YouTube Mobile!'),
            google: () => openMobileSite('https://www.google.com', 'Google', 'Abrindo Google!'),
            gmail: () => openMobileSite('https://mail.google.com', 'Gmail', 'Abrindo Gmail!'),
            facebook: () => openMobileSite('https://m.facebook.com', 'Facebook', 'Abrindo Facebook Mobile!'),
            instagram: () => openMobileSite('https://www.instagram.com', 'Instagram', 'Abrindo Instagram!'),
            twitter: () => openMobileSite('https://mobile.twitter.com', 'Twitter', 'Abrindo Twitter Mobile!'),
            configurações: () => {
                console.log('✅ Comando de configurações mobile detectado!');
                if (window.jarvisConfig) {
                    window.jarvisConfig.showQuickSettings();
                }
                return true;
            },
            teste: () => {
                console.log('✅ Comando de teste mobile detectado!');
                showMobileToast("Executando diagnóstico mobile...");
                
                if (window.jarvisConfig) {
                    window.jarvisConfig.diagnose().then(diagnosis => {
                        const status = diagnosis.apiConnectivity ? 'Sistema mobile funcionando normalmente' : 'Problemas de conectividade detectados';
                        showMobileToast(status);
                        
                        if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                            window.jarvisTTS.speak(status);
                        }
                    });
                }
                return true;
            }
        };
        
        // Verificar comandos
        for (const [keyword, action] of Object.entries(mobileCommands)) {
            if (msg.includes(keyword)) {
                return action();
            }
        }
        
        return false;
    }
    
    async function sendMobileToAPI(message) {
        const config = window.jarvisConfig;
        const apiUrl = config.getApiUrl();
        
        console.log('🌐 Enviando para API mobile:', apiUrl);
        
        try {
            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_id: 'mobile_user',
                    session_id: 'mobile_session',
                    platform: 'mobile'
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
            console.error('❌ Erro na API mobile:', error);
            
            // Respostas de fallback para mobile
            const mobileFallbackResponses = [
                "Desculpe, estou com problemas de conectividade no momento. Tente novamente.",
                "Não consegui processar sua solicitação agora. Verifique sua conexão.",
                "Sistema temporariamente indisponível. Tente novamente mais tarde.",
                "Erro de comunicação com o servidor mobile."
            ];
            
            const randomResponse = mobileFallbackResponses[Math.floor(Math.random() * mobileFallbackResponses.length)];
            throw new Error(randomResponse);
        }
    }
    
    // ===== FUNÇÕES DO CHAT MOBILE =====
    
    let mobileChatHistory = [];
    let mobileChatVisible = false;
    
    function toggleMobileChatCanvas() {
        const chatCanvas = document.getElementById('mobileChat');
        if (!chatCanvas) {
            console.warn('⚠️ Chat canvas mobile não encontrado');
            return;
        }
        
        if (mobileChatVisible) {
            // Fechar chat mobile
            $(chatCanvas).offcanvas('hide');
            mobileChatVisible = false;
            console.log('💬 Chat mobile fechado');
        } else {
            // Abrir chat mobile e carregar histórico
            loadMobileChatHistory();
            $(chatCanvas).offcanvas('show');
            mobileChatVisible = true;
            console.log('💬 Chat mobile aberto');
        }
    }
    
    function addMobileMessageToChat(message, sender) {
        const timestamp = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const chatMessage = {
            id: Date.now(),
            message: message,
            sender: sender, // 'user' ou 'jarvis'
            timestamp: timestamp,
            time: new Date()
        };
        
        mobileChatHistory.push(chatMessage);
        
        // Limitar histórico a 50 mensagens
        if (mobileChatHistory.length > 50) {
            mobileChatHistory = mobileChatHistory.slice(-50);
        }
        
        console.log('💬 Mensagem mobile adicionada ao chat:', chatMessage);
        
        // Atualizar interface se chat estiver visível
        if (mobileChatVisible) {
            loadMobileChatHistory();
        }
        
        // Salvar no localStorage
        saveMobileChatHistory();
    }
    
    function loadMobileChatHistory() {
        const chatBody = document.getElementById('mobile-chat-body');
        if (!chatBody) {
            console.warn('⚠️ Chat body mobile não encontrado');
            return;
        }
        
        // Carregar histórico do localStorage
        loadMobileChatFromStorage();
        
        if (mobileChatHistory.length === 0) {
            chatBody.innerHTML = `
                <div class="text-center text-light p-4">
                    <i class="bi bi-chat-dots" style="font-size: 3rem; opacity: 0.5;"></i>
                    <p class="mt-3 mb-0">Nenhuma conversa ainda</p>
                    <small class="text-muted">Comece digitando uma mensagem</small>
                </div>
            `;
            return;
        }
        
        let chatHTML = '';
        
        mobileChatHistory.forEach(msg => {
            const isUser = msg.sender === 'user';
            const messageClass = isUser ? 'sender_message' : 'receiver_message';
            const alignClass = isUser ? 'ms-auto' : 'me-auto';
            
            chatHTML += `
                <div class="d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}">
                    <div class="${messageClass}" style="max-width: 85%;">
                        <div class="message-content">
                            ${escapeHtml(msg.message)}
                        </div>
                        <div class="message-time">
                            ${msg.timestamp}
                        </div>
                    </div>
                </div>
            `;
        });
        
        chatBody.innerHTML = chatHTML;
        
        // Scroll para a última mensagem
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 100);
    }
    
    function saveMobileChatHistory() {
        try {
            localStorage.setItem('jarvis_mobile_chat_history', JSON.stringify(mobileChatHistory));
        } catch (error) {
            console.warn('⚠️ Erro ao salvar histórico do chat mobile:', error);
        }
    }
    
    function loadMobileChatFromStorage() {
        try {
            const saved = localStorage.getItem('jarvis_mobile_chat_history');
            if (saved) {
                mobileChatHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar histórico do chat mobile:', error);
            mobileChatHistory = [];
        }
    }
    
    function clearMobileChatHistory() {
        mobileChatHistory = [];
        saveMobileChatHistory();
        loadMobileChatHistory();
        console.log('💬 Histórico do chat mobile limpo');
        showMobileToast('Histórico limpo');
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ===== FUNÇÕES AUXILIARES MOBILE =====
    
    function showMobileToast(message, duration = 3000) {
        // Criar toast mobile
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 170, 255, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            z-index: 10000;
            font-size: 14px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: mobileToastIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'mobileToastOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
    
    function showMobileQuickActions() {
        const quickActions = document.getElementById('mobileQuickActions');
        if (quickActions) {
            quickActions.hidden = !quickActions.hidden;
            console.log('⚡ Quick actions mobile toggled');
        }
    }
    
    function testMobileConnectivity() {
        showMobileToast('Testando conectividade mobile...');
        if (window.jarvisConfig && window.jarvisConfig.testConnectivity) {
            window.jarvisConfig.testConnectivity();
        }
    }
    
    function testMobileTTS() {
        showMobileToast('Testando voz mobile...');
        if (window.jarvisConfig && window.jarvisConfig.testTTS) {
            window.jarvisConfig.testTTS();
        }
    }
    
    function testMobileMicrophone() {
        showMobileToast('Testando microfone mobile...');
        if (window.jarvisConfig && window.jarvisConfig.testMicrophone) {
            window.jarvisConfig.testMicrophone();
        }
    }
    
    async function mobileDiagnose() {
        showMobileToast('Executando diagnóstico mobile...');
        
        const diagnosis = {
            environment: 'mobile',
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            online: navigator.onLine,
            connection: navigator.connection ? navigator.connection.effectiveType : 'unknown',
            battery: navigator.getBattery ? await navigator.getBattery() : null,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Diagnóstico mobile completo:', diagnosis);
        return diagnosis;
    }
    
    // Expor funções globalmente para uso em outros scripts mobile
    window.jarvisMobileChat = {
        addMessage: addMobileMessageToChat,
        loadHistory: loadMobileChatHistory,
        clearHistory: clearMobileChatHistory,
        toggle: toggleMobileChatCanvas
    };
    
    window.jarvisMobile = {
        showToast: showMobileToast,
        showQuickActions: showMobileQuickActions,
        testConnectivity: testMobileConnectivity,
        testTTS: testMobileTTS,
        testMicrophone: testMobileMicrophone,
        diagnose: mobileDiagnose
    };
    
    // Carregar histórico mobile na inicialização
    loadMobileChatFromStorage();
    
    console.log('🎯 JARVIS Mobile script carregado com sucesso!');
});

// Adicionar estilos de animação para toasts
const mobileToastStyles = document.createElement('style');
mobileToastStyles.textContent = `
    @keyframes mobileToastIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes mobileToastOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .mobile-btn.recording {
        background: linear-gradient(45deg, #FF0000, #FF4444) !important;
        animation: recordingPulse 1s infinite;
    }
    
    @keyframes recordingPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(mobileToastStyles);
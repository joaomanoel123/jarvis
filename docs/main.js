$(document).ready(function () {

    eel.init()()
    
    // Otimizações para mobile
    initializeMobileOptimizations();
    
    // Inicializar sequência de loading
    initializeJarvis();
    
    // Função de otimizações para mobile
    function initializeMobileOptimizations() {
        console.log('📱 Inicializando otimizações mobile...');
        
        // Detectar dispositivo móvel
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 768;
        
        if (isMobile || isSmallScreen) {
            console.log('📱 Dispositivo móvel detectado');
            
            // Adicionar classe mobile ao body
            $('body').addClass('mobile-device');
            
            // Prevenir zoom duplo toque
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            
            // Melhorar performance em mobile
            document.addEventListener('touchstart', function() {}, {passive: true});
            document.addEventListener('touchmove', function() {}, {passive: true});
            
            // Otimizar SiriWave para mobile
            if (typeof SiriWave !== 'undefined') {
                // Reduzir complexidade da animação em mobile
                const originalInitSiriWave = window.initSiriWave;
                window.initSiriWave = function() {
                    if (container && typeof SiriWave !== 'undefined') {
                        try {
                            sw = new SiriWave({
                                container: container,
                                width: Math.min(container.clientWidth || 320, 350),
                                height: isSmallScreen ? 100 : 160,
                                style: "ios9",
                                amplitude: isSmallScreen ? 0.8 : 1,
                                speed: isSmallScreen ? 0.25 : 0.30,
                                autostart: true
                            });
                            console.log('🌊 SiriWave otimizado para mobile');
                        } catch (error) {
                            console.warn('⚠️ Erro ao inicializar SiriWave mobile:', error);
                        }
                    }
                };
            }
            
            // Ajustar timeouts para mobile (conexão mais lenta)
            if (window.PlayAssistant) {
                const originalTimeout = 45000;
                const mobileTimeout = 60000; // 60 segundos para mobile
                console.log(`⏱️ Timeout ajustado para mobile: ${mobileTimeout}ms`);
            }
            
            // Otimizar animações para mobile
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    /* Reduzir animações complexas em mobile */
                    .svg-frame {
                        animation-duration: 3s !important;
                    }
                    
                    svg {
                        animation-duration: 6s !important;
                    }
                    
                    /* Melhorar performance de scroll */
                    * {
                        -webkit-transform: translateZ(0);
                        transform: translateZ(0);
                    }
                    
                    /* Otimizar hover states para touch */
                    .glow-on-hover:hover:before {
                        opacity: 0 !important;
                    }
                    
                    /* Melhor feedback tátil */
                    .glow-on-hover:active {
                        transform: scale(0.95) !important;
                        transition: transform 0.1s !important;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Adicionar suporte a gestos
            addMobileGestures();
            
            console.log('✅ Otimizações mobile aplicadas');
        }
    }
    
    // Função para adicionar gestos mobile
    function addMobileGestures() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        // Gesto de swipe para abrir/fechar chat
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});
        
        document.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipeGesture();
        }, {passive: true});
        
        function handleSwipeGesture() {
            const swipeThreshold = 100;
            const swipeDistance = touchStartY - touchEndY;
            
            // Swipe up para abrir chat (apenas se estiver na tela principal)
            if (swipeDistance > swipeThreshold && !$('#Oval').attr('hidden')) {
                console.log('👆 Swipe up detectado - abrindo chat');
                $('#ChatBtn').click();
            }
        }
        
        // Toque duplo para ativar microfone (apenas na tela principal)
        let lastTap = 0;
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Toque duplo detectado
                if (!$('#Oval').attr('hidden') && !$('#MicBtn').attr('hidden')) {
                    console.log('👆👆 Toque duplo detectado - ativando microfone');
                    e.preventDefault();
                    $('#MicBtn').click();
                }
            }
            lastTap = currentTime;
        }, {passive: false});
        
        console.log('👆 Gestos mobile adicionados: swipe up (chat), toque duplo (mic)');
    }

    // Verificar se textillate está disponível antes de usar
    if (typeof $.fn.textillate === 'function') {
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
    } else {
        console.warn('Textillate não carregou, animações de texto desabilitadas');
    }

    // Siri configuration
    var container = document.getElementById("siri-container");
    var sw = null;
    
    function initSiriWave() {
        if (container && typeof SiriWave !== 'undefined') {
            try {
                sw = new SiriWave({
                    container: container,
                    width: container.clientWidth || 320,
                    height: 160,
                    style: "ios9",
                    amplitude: 1,
                    speed: 0.30,
                    autostart: true
                });
                console.log('SiriWave inicializado com sucesso');
            } catch (error) {
                console.warn('Erro ao inicializar SiriWave:', error);
            }
        } else {
            console.warn('SiriWave não disponível ou container não encontrado');
        }
    }
    
    // Inicializar SiriWave
    initSiriWave();
    
    // Recriar SiriWave no resize (método mais compatível)
    window.addEventListener('resize', function() {
        if (container && sw) {
            try {
                // Destruir instância anterior se existir
                if (sw && typeof sw.stop === 'function') {
                    sw.stop();
                }
                // Recriar com nova largura
                initSiriWave();
            } catch (error) {
                console.warn('Erro no resize do SiriWave:', error);
            }
        }
    });

    // Siri message animation
    if (typeof $.fn.textillate === 'function') {
        $('.siri-message').textillate({
            loop: true,
            sync: true,
            in: {
                effect: "fadeInUp",
                sync: true,
            },
            out: {
                effect: "fadeOutUp",
                sync: true,
            },
        });
    }

    // mic button click event

    $("#MicBtn").click(function () { 
        // Ativar SiriWave se disponível
        if (sw && typeof sw.start === 'function') {
            sw.start();
        }
        eel.playAssistantSound()
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        eel.allCommands()()
    });


    function doc_keyUp(e) {
        // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time

        if (e.key === 'j' && e.metaKey) {
            eel.playAssistantSound()
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            eel.allCommands()()
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);

    // Configuração da API do Render
    const DEFAULT_API_URL = 'https://jarvis-tdgt.onrender.com';
    
    // Função para enviar mensagem para o assistente
    function PlayAssistant(message) {
        if (message != "") {
            console.log('💬 Enviando mensagem:', message);
            
            // Verificar comandos locais primeiro (GitHub Pages)
            if (handleLocalCommands(message)) {
                return;
            }
            
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            
            // Ativar SiriWave se disponível
            if (sw && typeof sw.start === 'function') {
                sw.start();
            }
            
            // Mostrar indicador de carregamento
            updateWishMessage("🤖 Processando sua mensagem...");
            
            // URL da API (Render por padrão, ou configurada pelo usuário)
            const apiUrl = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
            console.log('🔗 Usando API:', apiUrl);
            
            // Timeout mais longo para cold start do Render
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 segundos
            
            fetch(apiUrl.replace(/\/$/, '') + '/command', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message }),
                signal: controller.signal
            })
            .then(response => {
                clearTimeout(timeoutId);
                console.log('📡 Resposta da API:', response.status, response.statusText);
                
                if (!response.ok) {
                    if (response.status === 503) {
                        throw new Error('Servidor temporáriamente indisponível (cold start). Tente novamente em alguns segundos.');
                    } else if (response.status === 500) {
                        throw new Error('Erro interno do servidor. Verifique se a chave API está configurada.');
                    } else {
                        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('📝 Dados recebidos:', data);
                
                if (data && data.reply) {
                    updateWishMessage(data.reply);
                    console.log('✅ Resposta processada com sucesso');
                    
                    // Se há função eel disponível, usa também
                    if (window.eel && window.eel.exposed_functions && window.eel.exposed_functions.receiverText) {
                        window.eel.exposed_functions.receiverText(data.reply);
                    }
                } else if (data && data.error) {
                    // Tratar erros específicos da API
                    console.log('❌ Erro da API:', data);
                    
                    let errorMessage = data.reply || 'Erro desconhecido';
                    
                    if (data.error === 'missing_api_key') {
                        errorMessage = "⚠️ Chave da API do Google não configurada no servidor. Entre em contato com o administrador.";
                    } else if (data.error === 'network_error') {
                        errorMessage = "🌐 Erro de conexão com a API do Google. Verifique a internet do servidor.";
                    } else if (data.error === 'format_error') {
                        errorMessage = "📝 Erro no formato da resposta da API do Google.";
                    } else if (data.error === 'internal_error') {
                        errorMessage = `🔧 Erro interno: ${data.error_type || 'Desconhecido'}. Detalhes: ${data.details || 'N/A'}`;
                    }
                    
                    updateWishMessage(errorMessage);
                    
                    // Log detalhado para debug
                    if (data.details) {
                        console.log('🔍 Detalhes do erro:', data.details);
                    }
                } else {
                    updateWishMessage("🤖 Resposta inválida da API. Tente novamente.");
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error('❌ Erro na API:', error);
                
                if (error.name === 'AbortError') {
                    updateWishMessage("⏱️ Timeout: A API demorou muito para responder. O servidor pode estar iniciando (cold start). Tente novamente em 30 segundos.");
                } else if (error.message.includes('Failed to fetch')) {
                    updateWishMessage("🚫 Erro de conexão: Verifique sua internet ou se a API está disponível.");
                } else {
                    updateWishMessage(`❌ ${error.message}`);
                }
            })
            .finally(() => {
                // Parar SiriWave se disponível
                if (sw && typeof sw.stop === 'function') {
                    sw.stop();
                }
                
                // Limpar input e resetar botões
                $("#chatbox").val("");
                $("#MicBtn").attr('hidden', false);
                $("#SendBtn").attr('hidden', true);
                
                // Voltar para a tela principal após 5 segundos (mais tempo para ler a resposta)
                setTimeout(() => {
                    $("#SiriWave").attr("hidden", true);
                    $("#Oval").attr("hidden", false);
                    updateWishMessage("Ask me anything");
                }, 5000);
            });
        }
    }
    
    // Função para atualizar a mensagem
    function updateWishMessage(text) {
        $("#WishMessage").text(text);
        
        // Integração com TTS - falar a mensagem se disponível
        if (window.jarvisTTS && typeof window.jarvisTTS.speakResponse === 'function') {
            // Aguardar um pouco para a mensagem aparecer na tela
            setTimeout(() => {
                window.jarvisTTS.speakResponse(text);
            }, 500);
        }
    }
    
    // Função para mostrar diálogo de permissão elegante
    function showPermissionDialog(title, message, url, loadingMessage, successMessage) {
        // Limpar input imediatamente
        $("#chatbox").val("");
        $("#MicBtn").attr('hidden', false);
        $("#SendBtn").attr('hidden', true);
        
        // Detectar se é dispositivo móvel
        const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Criar o diálogo personalizado responsivo
        const dialogHtml = `
            <div id="permissionDialog" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                padding: ${isMobile ? '20px' : '40px'};
                box-sizing: border-box;
            ">
                <div style="
                    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                    border: 2px solid #00d4ff;
                    border-radius: ${isMobile ? '20px' : '15px'};
                    padding: ${isMobile ? '25px 20px' : '30px'};
                    max-width: ${isMobile ? '350px' : '400px'};
                    width: ${isMobile ? '95%' : '90%'};
                    text-align: center;
                    box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
                    color: #00d4ff;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-height: 90vh;
                    overflow-y: auto;
                ">
                    <h3 style="margin: 0 0 ${isMobile ? '15px' : '20px'} 0; font-size: ${isMobile ? '20px' : '24px'}; text-shadow: 0 0 10px #00d4ff; line-height: 1.3;">${title}</h3>
                    <p style="margin: 0 0 ${isMobile ? '25px' : '30px'} 0; font-size: ${isMobile ? '15px' : '16px'}; line-height: 1.5;">${message}</p>
                    <div style="display: flex; gap: ${isMobile ? '12px' : '15px'}; justify-content: center; flex-direction: ${isMobile ? 'column' : 'row'};">
                        <button id="permissionAllow" style="
                            background: rgba(0, 212, 255, 0.2);
                            border: 2px solid #00d4ff;
                            color: #00d4ff;
                            padding: ${isMobile ? '15px 20px' : '12px 25px'};
                            border-radius: ${isMobile ? '12px' : '8px'};
                            cursor: pointer;
                            font-size: ${isMobile ? '18px' : '16px'};
                            font-weight: bold;
                            transition: all 0.3s ease;
                            min-height: ${isMobile ? '50px' : 'auto'};
                            touch-action: manipulation;
                            order: ${isMobile ? '1' : '0'};
                        ">✅ Sim, abrir</button>
                        <button id="permissionDeny" style="
                            background: rgba(255, 0, 0, 0.2);
                            border: 2px solid #ff4444;
                            color: #ff4444;
                            padding: ${isMobile ? '15px 20px' : '12px 25px'};
                            border-radius: ${isMobile ? '12px' : '8px'};
                            cursor: pointer;
                            font-size: ${isMobile ? '18px' : '16px'};
                            font-weight: bold;
                            transition: all 0.3s ease;
                            min-height: ${isMobile ? '50px' : 'auto'};
                            touch-action: manipulation;
                            order: ${isMobile ? '2' : '0'};
                        ">❌ Cancelar</button>
                    </div>
                    <p style="margin: ${isMobile ? '15px' : '20px'} 0 0 0; font-size: ${isMobile ? '11px' : '12px'}; opacity: 0.7; line-height: 1.3;">🔒 Sua segurança é importante para nós</p>
                </div>
            </div>
        `;
        
        // Adicionar o diálogo ao body
        $('body').append(dialogHtml);
        
        // Adicionar efeitos hover via JavaScript
        $('#permissionAllow').hover(
            function() { $(this).css('background', 'rgba(0, 212, 255, 0.4)'); },
            function() { $(this).css('background', 'rgba(0, 212, 255, 0.2)'); }
        );
        
        $('#permissionDeny').hover(
            function() { $(this).css('background', 'rgba(255, 0, 0, 0.4)'); },
            function() { $(this).css('background', 'rgba(255, 0, 0, 0.2)'); }
        );
        
        // Handler para "Sim, abrir"
        $('#permissionAllow').click(function() {
            $('#permissionDialog').remove();
            openExternalSite(url, loadingMessage, successMessage);
        });
        
        // Handler para "Cancelar"
        $('#permissionDeny').click(function() {
            $('#permissionDialog').remove();
            updateWishMessage("❌ Operação cancelada pelo usuário");
            
            // Voltar para tela principal após 2 segundos
            setTimeout(() => {
                updateWishMessage("Ask me anything");
            }, 2000);
        });
        
        // Fechar com ESC
        $(document).on('keydown.permissionDialog', function(e) {
            if (e.key === 'Escape') {
                $('#permissionDialog').remove();
                $(document).off('keydown.permissionDialog');
                updateWishMessage("❌ Operação cancelada");
                setTimeout(() => {
                    updateWishMessage("Ask me anything");
                }, 2000);
            }
        });
    }
    
    // Função para abrir site externo com feedback visual
    function openExternalSite(url, loadingMessage, successMessage) {
        console.log('🚀 Abrindo site:', url);
        
        // Mostrar tela de carregamento
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        
        // Ativar SiriWave
        if (sw && typeof sw.start === 'function') {
            sw.start();
        }
        
        updateWishMessage(loadingMessage);
        
        // Abrir site com múltiplas tentativas
        setTimeout(() => {
            try {
                // Primeira tentativa: window.open
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                
                if (newWindow) {
                    console.log('✅ Site aberto com window.open');
                    updateWishMessage(successMessage);
                } else {
                    console.warn('⚠️ window.open bloqueado, tentando alternativa...');
                    
                    // Segunda tentativa: criar link e clicar
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    console.log('✅ Site aberto com link click');
                    updateWishMessage(successMessage + " (Verifique se não foi bloqueado pelo navegador)");
                }
            } catch (error) {
                console.error('❌ Erro ao abrir site:', error);
                updateWishMessage(`❌ Erro ao abrir ${url}. Copie e cole: ${url}`);
                
                // Terceira tentativa: copiar para clipboard
                try {
                    navigator.clipboard.writeText(url);
                    updateWishMessage("📋 Link copiado! Cole no navegador: Ctrl+V");
                } catch (clipError) {
                    console.error('❌ Erro ao copiar para clipboard:', clipError);
                }
            }
            
            // Parar SiriWave
            if (sw && typeof sw.stop === 'function') {
                sw.stop();
            }
            
            // Voltar para tela principal
            setTimeout(() => {
                $("#SiriWave").attr("hidden", true);
                $("#Oval").attr("hidden", false);
                updateWishMessage("Ask me anything");
            }, 3000);
        }, 1000);
    }
    
    // Função para lidar com comandos locais no GitHub Pages
    function handleLocalCommands(message) {
        console.log('🔍 DEBUG: Verificando comando local:', message);
        const msg = message.toLowerCase().trim();
        console.log('🔍 DEBUG: Mensagem normalizada:', msg);
        
        // Comandos do WhatsApp - Detecção mais ampla
        const whatsappKeywords = ['whatsapp', 'whats app', 'whats', 'zap', 'abrir whatsapp', 'abra whatsapp', 'abre whatsapp'];
        const isWhatsAppCommand = whatsappKeywords.some(keyword => msg.includes(keyword));
        
        console.log('🔍 DEBUG: É comando WhatsApp?', isWhatsAppCommand);
        
        if (isWhatsAppCommand) {
            console.log('🎯 COMANDO WHATSAPP DETECTADO LOCALMENTE!');
            
            // Solicitar permissão do usuário
            showPermissionDialog(
                '📱 WhatsApp Web',
                'Deseja abrir o WhatsApp Web em uma nova aba?',
                'https://web.whatsapp.com',
                '📱 Abrindo WhatsApp Web...',
                '✅ WhatsApp Web aberto com sucesso!'
            );
            
            return true; // Comando processado localmente
        }
        
        // Outros comandos locais
        if (msg.includes('google') || msg.includes('pesquisar google') || msg.includes('pesquise google')) {
            console.log('🎯 Comando Google detectado localmente');
            
            showPermissionDialog(
                '🔍 Google',
                'Deseja abrir o Google em uma nova aba?',
                'https://www.google.com',
                '🔍 Abrindo Google...',
                '✅ Google aberto com sucesso!'
            );
            
            return true;
        }
        
        if (msg.includes('youtube')) {
            console.log('🎯 Comando YouTube detectado localmente');
            
            showPermissionDialog(
                '🎥 YouTube',
                'Deseja abrir o YouTube em uma nova aba?',
                'https://www.youtube.com',
                '🎥 Abrindo YouTube...',
                '✅ YouTube aberto com sucesso!'
            );
            
            return true;
        }
        
        console.log('🔍 DEBUG: Nenhum comando local detectado, enviando para API');
        return false; // Não é comando local, enviar para API
    }

    // toogle fucntion to hide and display mic and send button 
    function ShowHideButton(message) {
        if (message.length == 0) {
            $("#MicBtn").attr('hidden', false);
            $("#SendBtn").attr('hidden', true);
        }
        else {
            $("#MicBtn").attr('hidden', true);
            $("#SendBtn").attr('hidden', false);
        }
    }

    // key up event handler on text box
    $("#chatbox").keyup(function () {

        let message = $("#chatbox").val();
        ShowHideButton(message)
    
    });
    
    // send button event handler
    $("#SendBtn").click(function () {
    
        let message = $("#chatbox").val()
        PlayAssistant(message)
    
    });

    // settings button: configure backend URL
    $("#SettingsBtn").click(function () {
        // Usar o handler do TTS se disponível, senão usar o padrão
        if (window.jarvisTTS && typeof window.jarvisTTS.showTTSSettings === 'function') {
            // Se TTS está carregado, usar o menu expandido
            const options = [
                '🔧 Configurar URL da API',
                '🧪 Testar conexão',
                '💬 Teste rápido de mensagem',
                '🗣️ Configurações de Voz',
                '🎤 Testar Text-to-Speech',
                '📊 Ver logs do console',
                '❌ Cancelar'
            ];
            
            const choice = prompt(`Configurações do Jarvis:\n\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nEscolha uma opção (1-${options.length}):`);
            
            switch(choice) {
                case '1':
                    configureApiUrl();
                    break;
                case '2':
                    testApiConnection();
                    break;
                case '3':
                    PlayAssistant('Olá, você está funcionando?');
                    break;
                case '4':
                    window.jarvisTTS.showTTSSettings();
                    break;
                case '5':
                    window.jarvisTTS.testTTS();
                    break;
                case '6':
                    alert('📊 Verifique o console do navegador (F12) para ver os logs detalhados.');
                    break;
                default:
                    return;
            }
        } else {
            // Handler padrão (fallback)
            const options = [
                '🔧 Configurar URL da API',
                '🧪 Testar conexão',
                '💬 Teste rápido de mensagem',
                '📊 Ver logs do console',
                '❌ Cancelar'
            ];
            
            const choice = prompt(`Configurações do Jarvis:\n\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nEscolha uma opção (1-${options.length}):`);
            
            switch(choice) {
                case '1':
                    configureApiUrl();
                    break;
                case '2':
                    testApiConnection();
                    break;
                case '3':
                    PlayAssistant('Olá, você está funcionando?');
                    break;
                case '4':
                    alert('📊 Verifique o console do navegador (F12) para ver os logs detalhados.');
                    break;
                default:
                    return;
            }
        }
    });
    
    function configureApiUrl() {
        const current = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
        const input = prompt(`URL da API do Jarvis:\n\nPadrão: ${DEFAULT_API_URL}\nAtual: ${current}\n\nDigite a nova URL ou deixe vazio para usar o padrão:`, current);
        if (input === null) return; // cancel
        const trimmed = (input || '').trim();
        if (trimmed === '' || trimmed === DEFAULT_API_URL) {
            localStorage.removeItem('FRONT_API_URL');
            alert(`✅ Usando API padrão: ${DEFAULT_API_URL}`);
        } else {
            localStorage.setItem('FRONT_API_URL', trimmed);
            alert(`✅ API configurada: ${trimmed}`);
        }
        
        // Testar a conexão
        testApiConnection();
    }
    
    // Tornar funções disponíveis globalmente para o TTS
    window.jarvisSettingsHandler = function(choice) {
        switch(choice) {
            case '1':
                configureApiUrl();
                break;
            case '2':
                testApiConnection();
                break;
            case '3':
                PlayAssistant('Olá, você está funcionando?');
                break;
            case '6':
                alert('📊 Verifique o console do navegador (F12) para ver os logs detalhados.');
                break;
            default:
                return;
        }
    };
    

    

    // enter press event handler on chat box
    $("#chatbox").keypress(function (e) {
        key = e.which;
        if (key == 13) {
            let message = $("#chatbox").val()
            PlayAssistant(message)
        }
    });
    
    // Função de inicialização do Jarvis
    function initializeJarvis() {
        console.log('🤖 Iniciando sequência de inicialização do Jarvis...');
        
        // Estado inicial: mostrar apenas o loader
        showOnlyElement('#Loader');
        updateWishMessage('🔄 Initializing systems...');
        
        // Permitir pular animação com clique ou tecla
        let skipInitialization = false;
        
        function skipToMain() {
            if (!skipInitialization) {
                skipInitialization = true;
                console.log('⏩ Pulando animação de inicialização');
                goToMainScreen();
            }
        }
        
        // Event listeners para pular
        $(document).one('click', skipToMain);
        $(document).one('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                skipToMain();
            }
        });
        
        // Sequência de inicialização
        setTimeout(() => {
            if (skipInitialization) return;
            
            // Fase 1: Face Authentication
            showOnlyElement('#FaceAuth');
            updateWishMessage('🔍 Scanning biometric data...');
            
            setTimeout(() => {
                if (skipInitialization) return;
                
                // Fase 2: Authentication Success
                showOnlyElement('#FaceAuthSuccess');
                updateWishMessage('✅ Authentication successful!');
                
                setTimeout(() => {
                    if (skipInitialization) return;
                    
                    // Fase 3: Hello Greeting
                    showOnlyElement('#HelloGreet');
                    updateWishMessage('👋 Hello! I am J.A.R.V.I.S');
                    
                    setTimeout(() => {
                        if (skipInitialization) return;
                        
                        // Testar API durante a inicialização
                        updateWishMessage('🔌 Connecting to neural network...');
                        setTimeout(() => {
                            testApiConnection();
                        }, 500);
                        
                        setTimeout(() => {
                            if (skipInitialization) return;
                            goToMainScreen();
                        }, 2000);
                        
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 3000);
        
        // Função para mostrar apenas um elemento da tela de loading
        function showOnlyElement(selector) {
            $('#Loader, #FaceAuth, #FaceAuthSuccess, #HelloGreet').attr('hidden', true);
            $(selector).attr('hidden', false);
        }
        
        // Função para ir para a tela principal
        function goToMainScreen() {
            console.log('✅ Inicialização completa! Indo para tela principal...');
            
            // Remover event listeners de pular
            $(document).off('click keydown');
            
            // Esconder tela de loading e mostrar tela principal
            $('#Start').attr('hidden', true);
            $('#Oval').attr('hidden', false);
            
            // Mensagem de boas-vindas
            updateWishMessage('🎆 Welcome! How can I assist you today?');
            
            // Focar no input de texto
            setTimeout(() => {
                $('#chatbox').focus();
            }, 500);
        }
    }
    
    // Função melhorada para testar conexão com a API
    function testApiConnection() {
        const apiUrl = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
        console.log('🔌 Testando conexão com:', apiUrl);
        
        updateWishMessage('🔄 Testando conexão com a API...');
        
        const startTime = Date.now();
        
        fetch(apiUrl.replace(/\/$/, '') + '/health', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-cache'
        })
        .then(response => {
            const responseTime = Date.now() - startTime;
            console.log(`📡 Resposta em ${responseTime}ms:`, response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const responseTime = Date.now() - startTime;
            console.log('📝 Dados do health check:', data);
            
            if (data.status === 'ok') {
                const provider = data.api_provider || 'none';
                const providerEmoji = provider === 'groq' ? '⚡' : provider === 'google' ? '🤖' : '❌';
                const message = `✅ API conectada! (${responseTime}ms)\nProvedor: ${providerEmoji} ${provider.toUpperCase()}\nAmbiente: ${data.environment}\nAPI configurada: ${data.api_configured ? 'Sim' : 'Não'}`;
                updateWishMessage(message);
                console.log(`✅ API conectada com sucesso! Provedor: ${provider}`);
                
                if (!data.api_configured) {
                    console.warn('⚠️ Nenhuma API Key configurada no servidor');
                    setTimeout(() => {
                        updateWishMessage('⚠️ Nenhuma API Key configurada. Configure GROQ_API_KEY ou GOOGLE_API_KEY no Render Dashboard.');
                    }, 3000);
                }
            } else {
                updateWishMessage('⚠️ API respondeu mas status não é OK');
                console.warn('⚠️ API não está funcionando corretamente:', data);
            }
        })
        .catch(error => {
            const responseTime = Date.now() - startTime;
            console.error('❌ Erro de conexão com API:', error);
            
            let errorMessage = '❌ Erro de conexão';
            if (error.message.includes('Failed to fetch')) {
                errorMessage = '🚫 Erro de rede: Verifique sua conexão ou se a API está online';
            } else if (error.message.includes('503')) {
                errorMessage = '🔄 Servidor iniciando (cold start). Aguarde 30 segundos e tente novamente';
            } else {
                errorMessage = `❌ ${error.message}`;
            }
            
            updateWishMessage(`${errorMessage} (${responseTime}ms)`);
        });
    }

});

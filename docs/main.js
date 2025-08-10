$(document).ready(function () {

    eel.init()()
    
    // Inicializar sequência de loading
    initializeJarvis();

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
    }
    
    // Função para lidar com comandos locais no GitHub Pages
    function handleLocalCommands(message) {
        const msg = message.toLowerCase();
        
        // Comandos do WhatsApp
        if (msg.includes('whatsapp') || msg.includes('abrir whatsapp') || msg.includes('abra whatsapp')) {
            console.log('🎯 Comando WhatsApp detectado localmente');
            
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            
            // Ativar SiriWave
            if (sw && typeof sw.start === 'function') {
                sw.start();
            }
            
            updateWishMessage("📱 Abrindo WhatsApp Web para João Manoel...");
            
            // Abrir WhatsApp Web
            setTimeout(() => {
                try {
                    window.open('https://web.whatsapp.com', '_blank');
                    updateWishMessage("✅ WhatsApp Web aberto com sucesso!");
                    console.log('✅ WhatsApp Web aberto');
                } catch (error) {
                    console.error('❌ Erro ao abrir WhatsApp Web:', error);
                    updateWishMessage("❌ Erro ao abrir WhatsApp Web. Tente manualmente: web.whatsapp.com");
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
            
            return true; // Comando processado localmente
        }
        
        // Outros comandos locais podem ser adicionados aqui
        
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

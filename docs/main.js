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
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            
            // Ativar SiriWave se disponível
            if (sw && typeof sw.start === 'function') {
                sw.start();
            }
            
            // Mostrar indicador de carregamento
            updateWishMessage("🤖 Processando...");
            
            // URL da API (Render por padrão, ou configurada pelo usuário)
            const apiUrl = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
            
            fetch(apiUrl.replace(/\/$/, '') + '/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.reply) {
                    updateWishMessage(data.reply);
                    // Se há função eel disponível, usa também
                    if (window.eel && window.eel.exposed_functions && window.eel.exposed_functions.receiverText) {
                        window.eel.exposed_functions.receiverText(data.reply);
                    }
                } else {
                    updateWishMessage("🤖 Resposta inválida da API.");
                }
            })
            .catch(error => {
                console.error('Erro na API:', error);
                updateWishMessage(`❌ Erro: ${error.message}. Verifique a configuração da API.`);
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
                
                // Voltar para a tela principal após 3 segundos
                setTimeout(() => {
                    $("#SiriWave").attr("hidden", true);
                    $("#Oval").attr("hidden", false);
                    updateWishMessage("Ask me anything");
                }, 3000);
            });
        }
    }
    
    // Função para atualizar a mensagem
    function updateWishMessage(text) {
        $("#WishMessage").text(text);
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
    });
    

    

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
                        testApiConnection();
                        
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
        
        fetch(apiUrl.replace(/\/$/, '') + '/health')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                console.log('✅ API conectada com sucesso!');
                if (!data.api_configured) {
                    console.warn('⚠️ Google API Key não configurada no servidor');
                }
            } else {
                console.warn('⚠️ API não está funcionando corretamente');
            }
        })
        .catch(error => {
            console.error('❌ Erro de conexão com API:', error);
        });
    }

});

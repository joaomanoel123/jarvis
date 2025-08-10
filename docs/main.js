$(document).ready(function () {

    eel.init()()

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
    
    // Função para testar conexão com a API
    function testApiConnection() {
        const apiUrl = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
        updateWishMessage("🔄 Testando conexão...");
        
        fetch(apiUrl.replace(/\/$/, '') + '/health')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                updateWishMessage(`✅ API conectada! Ambiente: ${data.environment}`);
                if (!data.api_configured) {
                    updateWishMessage("⚠️ API conectada, mas Google API Key não configurada no servidor.");
                }
            } else {
                updateWishMessage("❌ API não está funcionando corretamente.");
            }
        })
        .catch(error => {
            console.error('Erro ao testar API:', error);
            updateWishMessage(`❌ Erro de conexão: ${error.message}`);
        });
    }
    
    // Testar conexão na inicialização
    setTimeout(testApiConnection, 2000);
    

    // enter press event handler on chat box
    $("#chatbox").keypress(function (e) {
        key = e.which;
        if (key == 13) {
            let message = $("#chatbox").val()
            PlayAssistant(message)
        }
    });




});

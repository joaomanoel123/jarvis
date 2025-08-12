$(document).ready(function () {

    // Configuração para GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    const API_URL = isGitHubPages ? 
        'https://jarvis-api-joao-manoel.onrender.com' : // URL da API no Render
        'http://localhost:8000'; // URL local para desenvolvimento

    console.log('🤖 Jarvis iniciando...');
    console.log('🌐 Modo:', isGitHubPages ? 'GitHub Pages' : 'Local');
    console.log('🔗 API URL:', API_URL);

    // Inicializar apenas se não estiver no GitHub Pages
    if (!isGitHubPages && typeof eel !== 'undefined') {
        eel.init()()
    }

    // Função de inicialização automática para GitHub Pages
    function initializeGitHubPages() {
        if (!isGitHubPages) return; // Só executar no GitHub Pages
        
        console.log('🚀 Iniciando sequência de inicialização do GitHub Pages...');
        
        // Sequência de inicialização simulando o backend
        setTimeout(() => {
            // Esconder loader, mostrar face auth
            $("#Loader").attr("hidden", true);
            $("#FaceAuth").attr("hidden", false);
            console.log('👤 Face Auth iniciado');
        }, 2000);
        
        setTimeout(() => {
            // Esconder face auth, mostrar face auth success
            $("#FaceAuth").attr("hidden", true);
            $("#FaceAuthSuccess").attr("hidden", false);
            console.log('✅ Face Auth Success');
        }, 3500);
        
        setTimeout(() => {
            // Esconder face auth success, mostrar hello greet
            $("#FaceAuthSuccess").attr("hidden", true);
            $("#HelloGreet").attr("hidden", false);
            console.log('👋 Hello Greet');
        }, 5000);
        
        setTimeout(() => {
            // Esconder start page, mostrar interface principal
            $("#Start").attr("hidden", true);
            $("#Oval").addClass("animate__animated animate__zoomIn");
            $("#Oval").attr("hidden", false);
            $("#WishMessage").text("Ask me anything");
            console.log('🎯 Interface principal carregada!');
        }, 6500);
    }
    
    // Inicializar automaticamente se estiver no GitHub Pages
    if (isGitHubPages) {
        initializeGitHubPages();
    }

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

    // Siri configuration
    var container = document.getElementById("siri-container");
    if (container) {
        var sw = new SiriWave({
            container: container,
            width: container.clientWidth || 320,
            height: 160,
            style: "ios9",
            amplitude: 1,
            speed: 0.30,
            autostart: true
        });
        window.addEventListener('resize', function() {
            sw.setWidth(container.clientWidth || 320);
            sw.setHeight(160);
        });
    }

    // Siri message animation
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

    // Função para exibir mensagens na interface
    function displayMessage(message, isUser = false) {
        const chatBody = document.getElementById('chat-canvas-body');
        if (chatBody) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'jarvis-message'}`;
            messageDiv.innerHTML = `<p>${message}</p>`;
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll para a mensagem mais recente
        }
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

    // mic button click event
    $("#MicBtn").click(function () {
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
            console.log('Enviando mensagem:', message);
            
            // Verificar comandos locais primeiro (GitHub Pages)
            if (handleLocalCommands(message)) {
                return;
            }
            
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            
            // Ativar SiriWave se disponível
            if (typeof sw !== 'undefined' && sw !== null) {
                sw.start();
            }
            
            // Mostrar indicador de carregamento
            $("#WishMessage").text("Processando sua mensagem...");
            
            // URL da API (Render por padrão, ou configurada pelo usuário)
            const apiUrl = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
            console.log('Usando API:', apiUrl);
            
            // Timeout mais longo para cold start do Render
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 segundos
            
            fetch(apiUrl.replace(new RegExp('/$'), '') + '/command', {
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
                console.log('Resposta da API:', response.status, response.statusText);
                
                if (!response.ok) {
                    if (response.status === 503) {
                        throw new Error('Servidor temporáriamente indisponível (cold start). Tente novamente em alguns segundos.');
                    } else if (response.status === 500) {
                        throw new Error('Erro interno do servidor. Verifique se a chave API está configurada.');
                    } else {
                        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
                    }
                }
                // Verificar se a resposta é realmente JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    // Se não for JSON, retornar como texto e tentar fazer parse
                    return response.text().then(text => {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            console.error('Resposta não é JSON válido:', text.substring(0, 200));
                            throw new Error('Resposta da API não é JSON válido');
                        }
                    });
                }
            })
            .then(data => {
                console.log('Dados recebidos:', data);
                
                if (data && data.reply) {
                    $("#WishMessage").text(data.reply);
                    console.log('Resposta processada com sucesso');
                    
                    // Se há função eel disponível, usa também
                    if (window.eel && window.eel.exposed_functions && window.eel.exposed_functions.receiverText) {
                        window.eel.exposed_functions.receiverText(data.reply);
                    }
                } else if (data && data.error) {
                    // Tratar erros específicos da API
                    console.log('Erro da API:', data);
                    
                    let errorMessage = data.reply || 'Erro desconhecido';
                    
                    if (data.error === 'missing_api_key') {
                        errorMessage = "Chave da API do Google não configurada no servidor. Entre em contato com o administrador.";
                    } else if (data.error === 'network_error') {
                        errorMessage = "Erro de conexão com a API do Google. Verifique a internet do servidor.";
                    } else if (data.error === 'format_error') {
                        errorMessage = "Erro no formato da resposta da API do Google.";
                    } else if (data.error === 'internal_error') {
                        errorMessage = `Erro interno: ${data.error_type || 'Desconhecido'}. Detalhes: ${data.details || 'N/A'}`;
                    }
                    
                    $("#WishMessage").text(errorMessage);
                    
                    // Log detalhado para debug
                    if (data.details) {
                        console.log('Detalhes do erro:', data.details);
                    }
                } else {
                    $("#WishMessage").text("Resposta inválida da API. Tente novamente.");
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error('Erro na API:', error);
                
                if (error.name === 'AbortError') {
                    $("#WishMessage").text("Timeout: A API demorou muito para responder. O servidor pode estar iniciando (cold start). Tente novamente em 30 segundos.");
                } else if (error.message.includes('Failed to fetch')) {
                    $("#WishMessage").text("Erro de conexão: Verifique sua internet ou se a API está disponível.");
                } else {
                    $("#WishMessage").text(`Erro: ${error.message}`);
                }
            })
            .finally(() => {
                // Parar SiriWave se disponível
                if (typeof sw !== 'undefined' && sw !== null) {
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
                    $("#WishMessage").text("Ask me anything");
                }, 5000);
            });
        }
    }
    
    // Função para lidar com comandos locais no GitHub Pages
    function handleLocalCommands(message) {
        console.log('DEBUG: Verificando comando local:', message);
        const msg = message.toLowerCase().trim();
        console.log('DEBUG: Mensagem normalizada:', msg);
        
        // Comandos do WhatsApp - Detecção mais ampla
        const whatsappKeywords = ['whatsapp', 'whats app', 'whats', 'zap', 'abrir whatsapp', 'abra whatsapp', 'abre whatsapp'];
        const isWhatsAppCommand = whatsappKeywords.some(keyword => msg.includes(keyword));
        
        console.log('DEBUG: É comando WhatsApp?', isWhatsAppCommand);
        
        if (isWhatsAppCommand) {
            console.log('COMANDO WHATSAPP DETECTADO LOCALMENTE!');
            window.open('https://web.whatsapp.com', '_blank');
            $("#WishMessage").text("Abrindo WhatsApp Web...");
            return true; // Comando processado localmente
        }
        
        // Outros comandos locais
        if (msg.includes('google') || msg.includes('pesquisar google') || msg.includes('pesquise google')) {
            console.log('Comando Google detectado localmente');
            window.open('https://www.google.com', '_blank');
            $("#WishMessage").text("Abrindo Google...");
            return true;
        }
        
        if (msg.includes('youtube')) {
            console.log('Comando YouTube detectado localmente');
            window.open('https://www.youtube.com', '_blank');
            $("#WishMessage").text("Abrindo YouTube...");
            return true;
        }
        
        console.log('DEBUG: Nenhum comando local detectado, enviando para API');
        return false; // Não é comando local, enviar para API
    }

    // settings button: configure backend URL
    $("#SettingsBtn").click(function () {
        const current = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
        const input = prompt(`URL da API do Jarvis:\n\nPadrão: ${DEFAULT_API_URL}\nAtual: ${current}\n\nDigite a nova URL ou deixe vazio para usar o padrão:`, current);
        if (input === null) return; // cancel
        const trimmed = (input || '').trim();
        if (trimmed === '' || trimmed === DEFAULT_API_URL) {
            localStorage.removeItem('FRONT_API_URL');
            alert(`Usando API padrão: ${DEFAULT_API_URL}`);
        } else {
            localStorage.setItem('FRONT_API_URL', trimmed);
            alert(`API configurada: ${trimmed}`);
        }
    });

    // Registrar Service Worker para PWA
    if ("serviceWorker" in navigator && window.location.hostname.includes("github.io")) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("/jarvis/sw.js")
                .then(function(registration) {
                    console.log("Service Worker registrado:", registration.scope);
                })
                .catch(function(error) {
                    console.log("Falha ao registrar Service Worker:", error);
                });
        });
    }

});
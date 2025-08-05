$(document).ready(function () {

    // Configuração para GitHub Pages (sem Eel)
    const isGitHubPages = true;
    
    // Configuração da API (você pode adicionar sua chave aqui)
    const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; // Configure sua chave aqui
    
    console.log('🌐 J.A.R.V.I.S Web Version carregado!');

    // Inicializar após carregamento
    setTimeout(function() {
        hideStart();
    }, 3000);

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
    var siriWave = new SiriWave({
        container: document.getElementById("siri-container"),
        width: 800,
        height: 200,
        style: "ios9",
        amplitude: "1",
        speed: "0.30",
        autostart: true
    });

    // Siri message animation
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

    // Função para mostrar status
    function showStatus(message, type = 'info') {
        const statusDiv = $(`<div class="status-message status-${type}">${message}</div>`);
        $('body').append(statusDiv);
        
        setTimeout(() => {
            statusDiv.fadeOut(() => statusDiv.remove());
        }, 3000);
    }

    // Função para chamar API do Gemini
    async function callGeminiAPI(message) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Resposta vazia da API');
            }
        } catch (error) {
            console.error('Erro na API:', error);
            return getOfflineResponse(message);
        }
    }

    // Respostas offline para quando a API não funcionar
    function getOfflineResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('hello')) {
            return 'Olá! Eu sou o J.A.R.V.I.S, seu assistente virtual. Como posso ajudá-lo hoje?';
        }
        
        if (lowerMessage.includes('como você está') || lowerMessage.includes('como vai')) {
            return 'Estou funcionando perfeitamente! Pronto para ajudá-lo com suas perguntas.';
        }
        
        if (lowerMessage.includes('que horas') || lowerMessage.includes('hora')) {
            const now = new Date();
            return `Agora são ${now.toLocaleTimeString('pt-BR')}.`;
        }
        
        if (lowerMessage.includes('data') || lowerMessage.includes('dia')) {
            const now = new Date();
            return `Hoje é ${now.toLocaleDateString('pt-BR')}.`;
        }
        
        if (lowerMessage.includes('pesquisar') || lowerMessage.includes('buscar') || lowerMessage.includes('procurar')) {
            const searchTerm = message.replace(/pesquisar|buscar|procurar/gi, '').trim();
            if (searchTerm) {
                const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
                window.open(googleUrl, '_blank');
                return `Abrindo pesquisa no Google para: "${searchTerm}"`;
            }
            return 'Por favor, me diga o que você gostaria de pesquisar.';
        }
        
        if (lowerMessage.includes('youtube') || lowerMessage.includes('reproduzir') || lowerMessage.includes('música')) {
            const searchTerm = message.replace(/youtube|reproduzir|música|no|tocar/gi, '').trim();
            if (searchTerm) {
                const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
                window.open(youtubeUrl, '_blank');
                return `Abrindo YouTube para: "${searchTerm}"`;
            }
            return 'Que música ou vídeo você gostaria de reproduzir no YouTube?';
        }
        
        if (lowerMessage.includes('whatsapp') || lowerMessage.includes('mensagem')) {
            return 'Para usar o WhatsApp, você precisa da versão desktop do J.A.R.V.I.S. Esta é a versão web com funcionalidades limitadas.';
        }
        
        if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu')) {
            return 'De nada! Estou sempre aqui para ajudar. Há mais alguma coisa que posso fazer por você?';
        }
        
        if (lowerMessage.includes('tchau') || lowerMessage.includes('adeus') || lowerMessage.includes('até logo')) {
            return 'Até logo! Foi um prazer ajudá-lo. Volte sempre que precisar!';
        }
        
        // Resposta padrão
        return `Recebi sua mensagem: "${message}". Esta é a versão web do J.A.R.V.I.S. Para funcionalidades completas, use a versão desktop. Posso ajudá-lo com pesquisas no Google, YouTube, ou responder perguntas básicas.`;
    }

    // Função principal para processar comandos
    async function PlayAssistant(message) {
        console.log('💬 Processando mensagem:', message);
        
        if (message.trim() === "") return;

        // Mostrar mensagem do usuário
        senderText(message);
        
        // Mostrar interface de processamento
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        
        // Limpar caixa de texto
        $("#chatbox").val("");
        $("#MicBtn").attr('hidden', false);
        $("#SendBtn").attr('hidden', true);
        
        try {
            // Chamar API do Gemini
            showStatus('Processando sua pergunta...', 'info');
            const response = await callGeminiAPI(message);
            
            // Mostrar resposta
            receiverText(response);
            showStatus('Resposta recebida!', 'success');
            
        } catch (error) {
            console.error('Erro ao processar:', error);
            const fallbackResponse = getOfflineResponse(message);
            receiverText(fallbackResponse);
            showStatus('Usando resposta offline', 'error');
        }
        
        // Voltar para interface principal
        setTimeout(() => {
            $("#Oval").attr("hidden", false);
            $("#SiriWave").attr("hidden", true);
        }, 1000);
    }

    // Função para mostrar mensagem do usuário
    function senderText(message) {
        var chatBox = document.getElementById("chat-canvas-body");
        if (message.trim() !== "") {
            chatBox.innerHTML += `<div class="row justify-content-end mb-4">
                <div class="width-size">
                    <div class="sender_message">${message}</div>
                </div>
            </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    // Função para mostrar resposta do assistente
    function receiverText(message) {
        var chatBox = document.getElementById("chat-canvas-body");
        if (message.trim() !== "") {
            chatBox.innerHTML += `<div class="row justify-content-start mb-4">
                <div class="width-size">
                    <div class="receiver_message">${message}</div>
                </div>
            </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    // Função para esconder tela inicial
    function hideStart() {
        $("#Start").attr("hidden", true);
        setTimeout(function () {
            $("#Oval").addClass("animate__animated animate__zoomIn");
        }, 1000);
        setTimeout(function () {
            $("#Oval").attr("hidden", false);
        }, 1000);
    }

    // Função para mostrar/esconder botões
    function ShowHideButton(message) {
        if (message.length == 0) {
            $("#MicBtn").attr('hidden', false);
            $("#SendBtn").attr('hidden', true);
        } else {
            $("#MicBtn").attr('hidden', true);
            $("#SendBtn").attr('hidden', false);
        }
    }

    // Event handlers
    $("#chatbox").on('input keyup paste', function () {
        let message = $(this).val();
        ShowHideButton(message);
    });
    
    $("#SendBtn").click(function () {
        let message = $("#chatbox").val();
        PlayAssistant(message);
    });
    
    $("#chatbox").keypress(function (e) {
        if (e.which == 13) {
            let message = $(this).val();
            PlayAssistant(message);
        }
    });

    // Microfone desabilitado na versão web
    $("#MicBtn").click(function() {
        showStatus('Microfone não disponível na versão web. Use a versão desktop para comandos de voz.', 'info');
    });

    // Mensagem de boas-vindas
    setTimeout(() => {
        showStatus('J.A.R.V.I.S Web carregado! Digite sua pergunta abaixo.', 'success');
    }, 4000);

    console.log('🎉 J.A.R.V.I.S Web inicializado com sucesso!');
});
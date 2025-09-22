e aqui estão os erroaquiaq$(document).ready(function () {

    // Configuração para GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    const API_URL = isGitHubPages ? 
        'https://jarvis-tdgt.onrender.com' : // URL da API no Render
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

    // mic button click event - Sistema melhorado de reconhecimento de voz
    $("#MicBtn").click(function () {
        console.log('🎤 Botão de microfone clicado');
        
        // Verificar se o sistema de reconhecimento de voz está disponível
        if (window.jarvisSpeechRecognition && window.jarvisSpeechRecognition.isAvailable()) {
            startAdvancedSpeechRecognition();
        } else {
            // Fallback para modo local se disponível
            console.log('⚠️ Sistema avançado não disponível, usando fallback');
            startOriginalSpeechRecognition();
        }
    });

    // Função de reconhecimento de voz avançado
    function startAdvancedSpeechRecognition() {
        console.log('🚀 Iniciando reconhecimento de voz avançado...');
        
        const speechRecognition = window.jarvisSpeechRecognition;
        
        // Se já está ativo, parar
        if (speechRecognition.isActive()) {
            console.log('🛑 Parando reconhecimento ativo...');
            speechRecognition.stop();
            resetMicButton();
            return;
        }
        
        // Configurar callbacks
        speechRecognition.onStart(() => {
            console.log('🎤 Reconhecimento iniciado');
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            
            // Ativar SiriWave se disponível
            if (typeof sw !== 'undefined' && sw !== null) {
                sw.start();
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
                    PlayAssistant(transcript);
                }, 500);
            }
        });
        
        speechRecognition.onError((error, message) => {
            console.error('❌ Erro no reconhecimento:', error, message);
            $("#WishMessage").text(`Erro: ${message}`);
            resetMicButton();
            
            // Voltar para interface principal após erro
            setTimeout(() => {
                $("#SiriWave").attr("hidden", true);
                $("#Oval").attr("hidden", false);
                $("#WishMessage").text("Ask me anything");
            }, 3000);
        });
        
        speechRecognition.onEnd(() => {
            console.log('🛑 Reconhecimento finalizado');
            resetMicButton();
        });
        
        // Iniciar reconhecimento
        const started = speechRecognition.start();
        if (!started) {
            console.error('❌ Falha ao iniciar reconhecimento');
            resetMicButton();
        }
    }
    
    // Função fallback para modo local
    function startOriginalSpeechRecognition() {
        if (typeof eel !== 'undefined' && eel.playAssistantSound) {
            eel.playAssistantSound();
            $("#Oval").attr("hidden", true);
            $("#SiriWave").attr("hidden", false);
            eel.allCommands()();
        } else {
            console.log('⚠️ Sistema de voz não disponível');
            $("#WishMessage").text("Sistema de voz não disponível. Use o campo de texto.");
            
            setTimeout(() => {
                $("#WishMessage").text("Ask me anything");
            }, 3000);
        }
    }
    
    // Função para resetar o botão do microfone
    function resetMicButton() {
        $('#MicBtn').html('<i class="bi bi-mic"></i>');
        $('#MicBtn').css('background', '');
        
        // Parar SiriWave se disponível
        if (typeof sw !== 'undefined' && sw !== null) {
            sw.stop();
        }
    }

    // Atalho de teclado para ativar reconhecimento de voz
    function doc_keyUp(e) {
        // Cmd+J (Mac) ou Ctrl+J (Windows/Linux) para ativar microfone
        if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            console.log('⌨️ Atalho de voz ativado (Cmd/Ctrl+J)');
            $("#MicBtn").click();
        }
        
        // Espaço para ativar microfone (apenas se não estiver digitando)
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            console.log('⌨️ Atalho de voz ativado (Espaço)');
            $("#MicBtn").click();
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
                    
                    // Usar TTS para falar a resposta (priorizar Google TTS se disponível)
                    if (window.jarvisGoogleTTS && window.jarvisGoogleTTS.isEnabled && window.jarvisGoogleTTS.apiKey) {
                        window.jarvisGoogleTTS.speakResponse(data.reply);
                    } else if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                        window.jarvisTTS.speakResponse(data.reply);
                    }
                    
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
            
            // Falar resposta se TTS estiver ativo (priorizar Google TTS)
            if (window.jarvisGoogleTTS && window.jarvisGoogleTTS.isEnabled && window.jarvisGoogleTTS.apiKey) {
                window.jarvisGoogleTTS.speak("Abrindo WhatsApp Web para você");
            } else if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                window.jarvisTTS.speak("Abrindo WhatsApp Web para você");
            }
            
            return true; // Comando processado localmente
        }
        
        // Outros comandos locais
        if (msg.includes('google') || msg.includes('pesquisar google') || msg.includes('pesquise google')) {
            console.log('Comando Google detectado localmente');
            window.open('https://www.google.com', '_blank');
            $("#WishMessage").text("Abrindo Google...");
            
            // Falar resposta se TTS estiver ativo (priorizar Google TTS)
            if (window.jarvisGoogleTTS && window.jarvisGoogleTTS.isEnabled && window.jarvisGoogleTTS.apiKey) {
                window.jarvisGoogleTTS.speak("Abrindo Google para você");
            } else if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                window.jarvisTTS.speak("Abrindo Google para você");
            }
            
            return true;
        }
        
        if (msg.includes('youtube')) {
            console.log('Comando YouTube detectado localmente');
            window.open('https://www.youtube.com', '_blank');
            $("#WishMessage").text("Abrindo YouTube...");
            
            // Falar resposta se TTS estiver ativo (priorizar Google TTS)
            if (window.jarvisGoogleTTS && window.jarvisGoogleTTS.isEnabled && window.jarvisGoogleTTS.apiKey) {
                window.jarvisGoogleTTS.speak("Abrindo YouTube para você");
            } else if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                window.jarvisTTS.speak("Abrindo YouTube para você");
            }
            
            return true;
        }
        
        console.log('DEBUG: Nenhum comando local detectado, enviando para API');
        return false; // Não é comando local, enviar para API
    }

    // settings button: configure backend URL and voice settings
    $("#SettingsBtn").click(function () {
        showJarvisSettings();
    });
    
    // Função principal de configurações
    function showJarvisSettings() {
        const options = [
            '🔧 Configurar URL da API',
            '🎤 Configurações de Voz',
            '🌐 Google Cloud TTS',
            '🧪 Testar Microfone',
            '🔊 Testar Text-to-Speech',
            '📊 Diagnóstico do Sistema',
            '📝 Ver Logs do Console',
            '❌ Cancelar'
        ];
        
        const choice = prompt(`Configurações do Jarvis:\
\
${options.map((opt, i) => `${i + 1}. ${opt}`).join('\
')}\
\
Escolha uma opção (1-${options.length}):`);
        
        switch(choice) {
            case '1':
                configureAPI();
                break;
            case '2':
                configureVoice();
                break;
            case '3':
                configureGoogleTTS();
                break;
            case '4':
                testMicrophone();
                break;
            case '5':
                testTTS();
                break;
            case '6':
                runDiagnostics();
                break;
            case '7':
                showConsoleLogs();
                break;
            default:
                return;
        }
    }
    
    // Configurar API
    function configureAPI() {
        const current = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
        const input = prompt(`URL da API do Jarvis:\
\
Padrão: ${DEFAULT_API_URL}\
Atual: ${current}\
\
Digite a nova URL ou deixe vazio para usar o padrão:`, current);
        if (input === null) return; // cancel
        const trimmed = (input || '').trim();
        if (trimmed === '' || trimmed === DEFAULT_API_URL) {
            localStorage.removeItem('FRONT_API_URL');
            alert(`Usando API padrão: ${DEFAULT_API_URL}`);
        } else {
            localStorage.setItem('FRONT_API_URL', trimmed);
            alert(`API configurada: ${trimmed}`);
        }
    }
    
    // Configurar voz
    function configureVoice() {
        if (window.jarvisTTS && window.jarvisTTS.showTTSSettings) {
            window.jarvisTTS.showTTSSettings();
        } else {
            alert('❌ Sistema de voz não disponível.');
        }
    }
    
    // Configurar Google TTS
    function configureGoogleTTS() {
        if (window.jarvisGoogleTTS && window.jarvisGoogleTTS.showGoogleTTSSettings) {
            window.jarvisGoogleTTS.showGoogleTTSSettings();
        } else {
            alert('❌ Google Cloud TTS não disponível.');
        }
    }
    
    // Testar microfone
    async function testMicrophone() {
        if (window.jarvisSpeechRecognition) {
            const result = await window.jarvisSpeechRecognition.testMicrophone();
            if (result) {
                alert('✅ Microfone funcionando corretamente!');
            } else {
                alert('❌ Problema com o microfone. Verifique as permissões.');
            }
        } else {
            alert('❌ Sistema de reconhecimento de voz não disponível.');
        }
    }
    
    // Testar TTS
    function testTTS() {
        if (window.jarvisTTS && window.jarvisTTS.testTTS) {
            window.jarvisTTS.testTTS();
        } else {
            alert('❌ Sistema de text-to-speech não disponível.');
        }
    }
    
    // Executar diagnósticos
    async function runDiagnostics() {
        let diagnostics = '🔍 Diagnóstico do Sistema Jarvis\
\
';
        
        // Verificar TTS Nativo
        if (window.jarvisTTS) {
            diagnostics += `🔊 TTS Nativo: ✅ Disponível (${window.jarvisTTS.voices.length} vozes)\n`;
        } else {
            diagnostics += '🔊 TTS Nativo: ❌ Não disponível\n';
        }
        
        // Verificar Google TTS
        if (window.jarvisGoogleTTS) {
            const hasApiKey = window.jarvisGoogleTTS.apiKey ? '✅' : '❌';
            const isEnabled = window.jarvisGoogleTTS.isEnabled ? '✅' : '❌';
            diagnostics += `🌐 Google TTS: ✅ Disponível\n`;
            diagnostics += `🔑 API Key: ${hasApiKey} ${window.jarvisGoogleTTS.apiKey ? 'Configurada' : 'Não configurada'}\n`;
            diagnostics += `⚡ Ativo: ${isEnabled} ${window.jarvisGoogleTTS.isEnabled ? 'Sim' : 'Não'}\n`;
        } else {
            diagnostics += '🌐 Google TTS: ❌ Não disponível\n';
        }
        
        // Verificar Speech Recognition
        if (window.jarvisSpeechRecognition) {
            const isAvailable = window.jarvisSpeechRecognition.isAvailable();
            diagnostics += `🎤 Speech Recognition: ${isAvailable ? '✅' : '❌'} ${isAvailable ? 'Disponível' : 'Não disponível'}\
`;
            
            if (isAvailable) {
                const micTest = await window.jarvisSpeechRecognition.testMicrophone();
                diagnostics += `🎤 Microfone: ${micTest ? '✅' : '❌'} ${micTest ? 'Funcionando' : 'Com problemas'}\
`;
            }
        } else {
            diagnostics += '🎤 Speech Recognition: ❌ Não disponível\
';
        }
        
        // Verificar navegador
        diagnostics += `🌐 Navegador: ${navigator.userAgent.split(' ').pop()}\
`;
        diagnostics += `🔒 HTTPS: ${window.location.protocol === 'https:' ? '✅' : '❌'}\
`;
        diagnostics += `🌍 Idioma: ${navigator.language}\
`;
        
        alert(diagnostics);
    }
    
    // Mostrar logs do console
    function showConsoleLogs() {
        alert('📝 Para ver os logs detalhados:\
\
1. Pressione F12 para abrir DevTools\
2. Clique na aba "Console"\
3. Veja os logs do Jarvis com emojis 🤖\
\
Logs importantes:\
• 🎤 Reconhecimento de voz\
• 🔊 Text-to-Speech\
• 📶 Conexões de API\
• ❌ Erros e avisos');
        console.log('📝 Logs do Jarvis - Abra o console para ver detalhes!');
    }

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
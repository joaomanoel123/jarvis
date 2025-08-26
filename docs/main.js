/**
 * INTEGRAÇÃO DO JARVIS CORE COM SEU CÓDIGO EXISTENTE
 * Este arquivo mostra como adaptar seu main.js atual para usar o sistema modular
 */

$(document).ready(function () {
    console.log('🚀 Inicializando sistema JARVIS integrado...');

    // ==============================================
    // INICIALIZAÇÃO DO SISTEMA MODULAR
    // ==============================================
    
    let jarvisCore = null;
    let jarvisTTS = null;
    let jarvisSpeechRecognition = null;

    // Inicializar módulos principais
    async function initializeModularSystem() {
        try {
            console.log('🔧 Carregando módulos do JARVIS...');

            // Configurações base
            const config = {
                debugMode: true,
                language: 'pt-BR',
                apiUrl: localStorage.getItem('FRONT_API_URL') || 'https://jarvis-tdgt.onrender.com',
                voiceSettings: {
                    rate: 1,
                    pitch: 1,
                    volume: 0.8,
                    voice: 'pt-BR'
                }
            };

            // Inicializar Core (se disponível)
            if (typeof JarvisCore !== 'undefined') {
                jarvisCore = new JarvisCore(config);
                await jarvisCore.init();
                console.log('✅ JARVIS Core carregado');

                // Conectar eventos do Core
                jarvisCore.on('jarvis:command:processed', (data) => {
                    console.log('📝 Comando processado pelo Core:', data);
                    updateWishMessage(data.response.text, true);
                });

                jarvisCore.on('jarvis:error:occurred', (data) => {
                    console.error('❌ Erro do Core:', data);
                    updateWishMessage('Desculpe, ocorreu um erro. Tente novamente.', true);
                });
            } else {
                console.warn('⚠️ JarvisCore não disponível, usando sistema híbrido');
            }

            // Conectar TTS (se disponível)
            if (typeof JarvisTTS !== 'undefined') {
                jarvisTTS = new JarvisTTS(config);
                await jarvisTTS.init();
                window.jarvisTTS = jarvisTTS; // Manter compatibilidade
                console.log('✅ JARVIS TTS carregado');
            }

            // Conectar Speech Recognition (se disponível)
            if (typeof JarvisSpeechRecognition !== 'undefined') {
                jarvisSpeechRecognition = new JarvisSpeechRecognition(config);
                await jarvisSpeechRecognition.init();
                window.jarvisSpeechRecognition = jarvisSpeechRecognition; // Manter compatibilidade
                console.log('✅ JARVIS Speech Recognition carregado');
            }

            // Conectar módulos entre si
            if (jarvisCore) {
                if (jarvisTTS) jarvisCore.connectModule('tts', jarvisTTS);
                if (jarvisSpeechRecognition) jarvisCore.connectModule('speech', jarvisSpeechRecognition);
            }

            console.log('🎆 Sistema modular inicializado com sucesso!');

        } catch (error) {
            console.error('❌ Erro na inicialização modular:', error);
            console.log('🔄 Usando sistema legado...');
        }
    }

    // ==============================================
    // FUNÇÃO PlayAssistant APRIMORADA
    // ==============================================
    
    // Função principal aprimorada que usa Core quando disponível
    function PlayAssistant(message) {
        if (message != "") {
            console.log('💬 Processando mensagem:', message);
            
            // Tentar usar o Core primeiro
            if (jarvisCore) {
                console.log('🧠 Usando JARVIS Core para processar comando');
                processWithCore(message);
                return;
            }

            // Fallback para sistema original
            console.log('🔄 Usando sistema original (API direta)');
            processWithOriginalSystem(message);
        }
    }

    // Processar com o Core
    async function processWithCore(message) {
        try {
            // Mostrar interface de processamento
            showProcessingUI();

            // Processar comando através do Core
            const response = await jarvisCore.processVoiceCommand(message);
            
            if (response && response.text) {
                // Resposta processada pelo Core
                console.log('✅ Resposta do Core:', response.text);
                updateWishMessage(response.text, true);
                
                // Se for comando local, parar aqui
                if (response.type === 'local') {
                    resetToMainScreen();
                    return;
                }
            }

            // Se o Core não processou completamente, enviar para API
            if (!response || response.type === 'unknown') {
                console.log('🌐 Enviando para API externa...');
                await processWithOriginalSystem(message);
            } else {
                resetToMainScreen();
            }

        } catch (error) {
            console.error('❌ Erro no processamento com Core:', error);
            // Fallback para sistema original
            processWithOriginalSystem(message);
        }
    }

    // Sistema original (sua implementação atual)
    async function processWithOriginalSystem(message) {
        // Verificar comandos locais primeiro
        if (handleLocalCommands(message)) {
            return;
        }

        showProcessingUI();

        const apiUrl = localStorage.getItem('FRONT_API_URL') || 'https://jarvis-tdgt.onrender.com';
        console.log('🔗 Usando API:', apiUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        try {
            const response = await fetch(apiUrl.replace(/\/$/, '') + '/command', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data && data.reply) {
                updateWishMessage(data.reply, true);
                console.log('✅ Resposta da API processada');
            } else if (data && data.error) {
                handleAPIError(data);
            } else {
                updateWishMessage("🤖 Resposta inválida da API. Tente novamente.", true);
            }

        } catch (error) {
            clearTimeout(timeoutId);
            handleNetworkError(error);
        } finally {
            resetToMainScreen();
        }
    }

    // ==============================================
    // FUNÇÕES DE INTERFACE APRIMORADAS
    // ==============================================

    function showProcessingUI() {
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        
        if (sw && typeof sw.start === 'function') {
            sw.start();
        }
        
        updateWishMessage("🤖 Processando sua mensagem...");
    }

    function resetToMainScreen() {
        // Parar SiriWave
        if (sw && typeof sw.stop === 'function') {
            sw.stop();
        }
        
        // Limpar input
        $("#chatbox").val("");
        $("#MicBtn").attr('hidden', false);
        $("#SendBtn").attr('hidden', true);
        
        // Voltar para tela principal após delay
        setTimeout(() => {
            $("#SiriWave").attr("hidden", true);
            $("#Oval").attr("hidden", false);
            updateWishMessage("Ask me anything");
        }, 5000);
    }

    function handleAPIError(data) {
        let errorMessage = data.reply || 'Erro desconhecido';
        
        const errorMappings = {
            'missing_api_key': "⚠️ Chave da API não configurada no servidor.",
            'network_error': "🌐 Erro de conexão com a API do Google.",
            'format_error': "📝 Erro no formato da resposta.",
            'internal_error': `🔧 Erro interno: ${data.error_type || 'Desconhecido'}`
        };

        if (errorMappings[data.error]) {
            errorMessage = errorMappings[data.error];
        }

        updateWishMessage(errorMessage, true);
        
        if (data.details) {
            console.log('🔍 Detalhes do erro:', data.details);
        }
    }

    function handleNetworkError(error) {
        console.error('❌ Erro na API:', error);
        
        let errorMessage = "❌ Erro de conexão";
        
        if (error.name === 'AbortError') {
            errorMessage = "⏱️ Timeout: A API demorou muito para responder.";
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = "🚫 Erro de conexão: Verifique sua internet.";
        } else {
            errorMessage = `❌ ${error.message}`;
        }
        
        updateWishMessage(errorMessage, true);
    }

    // ==============================================
    // EVENTOS DE VOZ APRIMORADOS
    // ==============================================

    $("#MicBtn").click(function () {
        console.log('🎤 Botão de microfone clicado');
        
        // Tentar usar sistema modular primeiro
        if (jarvisSpeechRecognition && jarvisSpeechRecognition.isAvailable()) {
            startModularSpeechRecognition();
        } else {
            // Fallback para sistema original
            console.log('🔄 Usando sistema de voz original');
            startOriginalSpeechRecognition();
        }
    });

    function startModularSpeechRecognition() {
        console.log('🎆 Iniciando reconhecimento modular...');
        
        const speechRecognition = jarvisSpeechRecognition;
        
        if (speechRecognition.isActive()) {
            console.log('⚠️ Reconhecimento já ativo, parando...');
            speechRecognition.stop();
            return;
        }

        // Configurar callbacks integrados
        speechRecognition.onStart(() => {
            console.log('🎤 Reconhecimento modular iniciado');
            showListeningUI();
        });

        speechRecognition.onInterim((transcript) => {
            console.log('⏳ Transcrição parcial:', transcript);
            updateWishMessage(`🎤 Ouvindo: "${transcript}"`);
        });

        speechRecognition.onResult((transcript, confidence) => {
            console.log('✅ Transcrição final:', transcript, 'Confiança:', confidence);
            resetMicInterface();
            
            if (transcript && transcript.trim().length > 0) {
                updateWishMessage(`💬 Você disse: "${transcript}"`);
                setTimeout(() => {
                    PlayAssistant(transcript);
                }, 1000);
            } else {
                updateWishMessage('⚠️ Nenhum comando detectado. Tente novamente.');
                setTimeout(() => updateWishMessage('Ask me anything'), 3000);
            }
        });

        speechRecognition.onError((error, message) => {
            console.error('❌ Erro no reconhecimento modular:', error, message);
            resetMicInterface();
            handleSpeechError(error, message);
        });

        speechRecognition.onEnd(() => {
            console.log('🔄 Reconhecimento modular finalizado');
            resetMicInterface();
        });

        // Iniciar reconhecimento
        const started = speechRecognition.start();
        
        if (!started) {
            console.error('❌ Falha ao iniciar reconhecimento modular');
            resetMicInterface();
            updateWishMessage('❌ Erro ao iniciar reconhecimento de voz.', true);
        }
    }

    function showListeningUI() {
        if (sw && typeof sw.start === 'function') {
            sw.start();
        }
        
        $("#Oval").attr("hidden", true);
        $("#SiriWave").attr("hidden", false);
        
        updateWishMessage('🎤 Escutando... Fale agora!');
        
        $('#MicBtn').html('<i class="bi bi-mic-fill"></i>');
        $('#MicBtn').css('background', 'rgba(255, 0, 0, 0.3)');
    }

    function resetMicInterface() {
        if (sw && typeof sw.stop === 'function') {
            sw.stop();
        }
        
        $("#SiriWave").attr("hidden", true);
        $("#Oval").attr("hidden", false);
        
        $('#MicBtn').html('<i class="bi bi-mic"></i>');
        $('#MicBtn').css('background', '');
    }

    function handleSpeechError(error, message) {
        let userMessage = '❌ Erro no reconhecimento de voz.';
        
        const errorMappings = {
            'not-allowed': '🚫 Permissão de microfone negada.',
            'no-speech': '🔇 Nenhuma fala detectada.',
            'audio-capture': '🎤 Erro na captação de áudio.',
            'network': '🌐 Erro de rede.',
            'timeout': '⏰ Tempo limite excedido.'
        };

        if (errorMappings[error]) {
            userMessage = errorMappings[error];
        }

        updateWishMessage(userMessage, true);
        
        setTimeout(() => {
            updateWishMessage('Ask me anything');
        }, 5000);
    }

    // ==============================================
    // FUNÇÃO updateWishMessage APRIMORADA
    // ==============================================

    function updateWishMessage(text, playAudio = false) {
        $("#WishMessage").text(text);
        
        if (playAudio) {
            // Tentar usar TTS modular primeiro
            if (jarvisTTS && typeof jarvisTTS.speakResponse === 'function') {
                setTimeout(() => {
                    jarvisTTS.speakResponse(text);
                }, 500);
            } 
            // Fallback para TTS global
            else if (window.jarvisTTS && typeof window.jarvisTTS.speakResponse === 'function') {
                setTimeout(() => {
                    window.jarvisTTS.speakResponse(text);
                }, 500);
            }
        }
    }

    // ==============================================
    // INICIALIZAÇÃO PRINCIPAL
    // ==============================================

    // Manter sua implementação de mobile, SiriWave, etc...
    initializeMobileOptimizations();
    
    // SiriWave (manter seu código)
    var container = document.getElementById("siri-container");
    var sw = null;
    initSiriWave();

    // Inicializar sistema modular após DOM pronto
    setTimeout(async () => {
        await initializeModularSystem();
        
        // Inicializar sequência original
        initializeJarvis();
    }, 1000);

    // ==============================================
    // MANTER SUAS IMPLEMENTAÇÕES EXISTENTES
    // ==============================================

    // Manter todas suas funções existentes:
    // - initializeMobileOptimizations()
    // - handleLocalCommands()
    // - ShowHideButton()
    // - configureApiUrl()
    // - testApiConnection()
    // - etc.

    // Eventos existentes
    $("#chatbox").keyup(function () {
        let message = $("#chatbox").val();
        ShowHideButton(message);
    });

    $("#SendBtn").click(function () {
        let message = $("#chatbox").val();
        PlayAssistant(message);
    });

    $("#chatbox").keypress(function (e) {
        if (e.which == 13) {
            let message = $("#chatbox").val();
            PlayAssistant(message);
        }
    });

    // Suas outras funções permanecem inalteradas...
    
    // ==============================================
    // COMPATIBILIDADE E MIGRAÇÃO GRADUAL
    // ==============================================

    // Expor funções para compatibilidade
    window.PlayAssistant = PlayAssistant;
    window.updateWishMessage = updateWishMessage;
    
    // Expor instâncias modulares
    window.jarvisCore = jarvisCore;
    
    console.log('🎆 Sistema JARVIS integrado carregado com sucesso!');
    console.log('🔧 Módulos disponíveis:', {
        core: !!jarvisCore,
        tts: !!jarvisTTS,
        speech: !!jarvisSpeechRecognition
    });

    // [Resto do seu código original aqui...]
});
/**
 * Configuração específica para JARVIS Mobile
 * Carrega automaticamente as configurações da versão PC
 */

// Configuração mobile específica
window.mobileConfig = {
    // Configurações de interface mobile
    ui: {
        enableGestures: true,
        enableVibration: true,
        enableToasts: true,
        animationSpeed: 'normal', // 'slow', 'normal', 'fast'
        theme: 'dark'
    },
    
    // Configurações de performance mobile
    performance: {
        reducedAnimations: false,
        lowPowerMode: false,
        cacheEnabled: true,
        preloadAssets: true
    },
    
    // Configurações de áudio mobile
    audio: {
        autoplay: false, // Devido às políticas mobile
        volume: 0.8,
        enableSpatialAudio: false
    },
    
    // Configurações de reconhecimento de voz mobile
    speech: {
        continuous: false,
        interimResults: true,
        maxAlternatives: 1,
        lang: 'pt-BR'
    }
};

// Função para carregar configurações da versão PC
function loadPCConfig() {
    // Tentar carregar do localStorage primeiro
    try {
        const savedConfig = localStorage.getItem('jarvisConfig');
        if (savedConfig) {
            const pcConfig = JSON.parse(savedConfig);
            console.log('📱 Configurações PC carregadas do localStorage');
            return pcConfig;
        }
    } catch (error) {
        console.warn('⚠️ Erro ao carregar configurações do localStorage:', error);
    }
    
    // Configuração padrão se não encontrar
    return {
        wakeWord: "Jarvis",
        voice: "pt-BR",
        theme: "dark",
        apiKey: null,
        API_URLS: {
            primary: 'https://jarvis-tdgt.onrender.com',
            fallback: 'https://jarvis-api-backup.onrender.com'
        },
        settings: {
            apiTimeout: 45000,
            language: 'pt-BR',
            debugMode: true
        }
    };
}

// Mesclar configurações PC com mobile
function initializeMobileConfig() {
    const pcConfig = loadPCConfig();
    
    // Criar configuração híbrida
    window.jarvisConfig = {
        ...pcConfig,
        
        // Sobrescrever com configurações mobile específicas
        getEnvironment: () => 'mobile',
        
        // Manter métodos da versão PC
        getApiUrl: function() {
            const customUrl = localStorage.getItem('FRONT_API_URL');
            if (customUrl) {
                return customUrl;
            }
            return this.API_URLS.primary;
        },
        
        // Configurações mobile específicas
        mobile: window.mobileConfig,
        
        // Métodos adaptados para mobile
        showQuickSettings: function() {
            if (window.jarvisMobile && window.jarvisMobile.showQuickActions) {
                window.jarvisMobile.showQuickActions();
            } else {
                // Fallback para configurações simples
                const options = [
                    '🔧 Configurar URL da API',
                    '🌐 Testar Conectividade', 
                    '🎤 Testar Microfone',
                    '🔊 Testar Text-to-Speech',
                    '📊 Diagnóstico Mobile',
                    '❌ Cancelar'
                ];
                
                const choice = prompt(`⚙️ Configurações JARVIS Mobile\n\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nEscolha uma opção (1-${options.length}):`);
                
                this.handleMobileSettingsChoice(choice);
            }
        },
        
        handleMobileSettingsChoice: function(choice) {
            switch(choice) {
                case '1':
                    this.configureApiUrl();
                    break;
                case '2':
                    this.testConnectivity();
                    break;
                case '3':
                    this.testMicrophone();
                    break;
                case '4':
                    this.testTTS();
                    break;
                case '5':
                    this.showMobileDiagnosis();
                    break;
                default:
                    return;
            }
        },
        
        configureApiUrl: function() {
            const current = this.getApiUrl();
            const newUrl = prompt(`🔧 Configurar URL da API Mobile:\n\nAtual: ${current}\nPadrão: ${this.API_URLS.primary}\n\nDigite a nova URL ou deixe vazio para usar a padrão:`, current);
            
            if (newUrl === null) return;
            
            const trimmed = (newUrl || '').trim();
            if (trimmed === '' || trimmed === this.API_URLS.primary) {
                localStorage.removeItem('FRONT_API_URL');
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast(`✅ Usando API padrão: ${this.API_URLS.primary}`);
                } else {
                    alert(`✅ Usando API padrão: ${this.API_URLS.primary}`);
                }
            } else {
                localStorage.setItem('FRONT_API_URL', trimmed);
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast(`✅ API configurada: ${trimmed}`);
                } else {
                    alert(`✅ API configurada: ${trimmed}`);
                }
            }
        },
        
        testConnectivity: async function() {
            const apiUrl = this.getApiUrl();
            console.log('🔍 Testando conectividade mobile:', apiUrl);
            
            if (window.jarvisMobile && window.jarvisMobile.showToast) {
                window.jarvisMobile.showToast('🔍 Testando conectividade...');
            }
            
            try {
                const startTime = Date.now();
                const response = await fetch(`${apiUrl}/health`, {
                    method: 'GET',
                    timeout: 10000
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const message = `✅ API funcionando!\n\nStatus: ${data.status || 'OK'}\nTempo: ${Date.now() - startTime}ms`;
                    
                    if (window.jarvisMobile && window.jarvisMobile.showToast) {
                        window.jarvisMobile.showToast('✅ API funcionando!');
                    } else {
                        alert(message);
                    }
                    return true;
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                console.error('❌ Erro de conectividade mobile:', error);
                const message = `❌ Erro de conectividade:\n\n${error.message}`;
                
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast('❌ Erro de conectividade');
                } else {
                    alert(message);
                }
                return false;
            }
        },
        
        testMicrophone: async function() {
            if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
                const message = '❌ Reconhecimento de voz não suportado neste navegador mobile.';
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast(message);
                } else {
                    alert(message);
                }
                return false;
            }
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach(track => track.stop());
                
                const message = '✅ Microfone funcionando!';
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast(message);
                    // Vibração de sucesso
                    if (navigator.vibrate) {
                        navigator.vibrate(100);
                    }
                } else {
                    alert(message);
                }
                return true;
            } catch (error) {
                const message = `❌ Problema com o microfone: ${error.message}`;
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast('❌ Problema com microfone');
                } else {
                    alert(message);
                }
                return false;
            }
        },
        
        testTTS: function() {
            if (!('speechSynthesis' in window)) {
                const message = '❌ Text-to-Speech não suportado neste navegador mobile.';
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast(message);
                } else {
                    alert(message);
                }
                return false;
            }
            
            try {
                const utterance = new SpeechSynthesisUtterance('Teste do sistema de voz mobile do Jarvis funcionando perfeitamente!');
                utterance.lang = 'pt-BR';
                utterance.rate = 1;
                utterance.pitch = 1;
                utterance.volume = this.mobile.audio.volume;
                
                speechSynthesis.speak(utterance);
                
                const message = '✅ Teste de voz executado! Você deve ouvir uma mensagem.';
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast('✅ Teste de voz executado!');
                    // Vibração de sucesso
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                } else {
                    alert(message);
                }
                return true;
            } catch (error) {
                const message = `❌ Erro no sistema de voz mobile: ${error.message}`;
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast('❌ Erro no sistema de voz');
                } else {
                    alert(message);
                }
                return false;
            }
        },
        
        showMobileDiagnosis: async function() {
            if (window.jarvisMobile && window.jarvisMobile.diagnose) {
                const diagnosis = await window.jarvisMobile.diagnose();
                
                const report = `📊 DIAGNÓSTICO MOBILE\n\n🌐 Ambiente: ${diagnosis.environment}\n📱 Plataforma: ${diagnosis.platform}\n📶 Online: ${diagnosis.online ? '✅' : '❌'}\n🔋 Bateria: ${diagnosis.battery ? Math.round(diagnosis.battery.level * 100) + '%' : 'N/A'}\n🌐 Conexão: ${diagnosis.connection}\n⏰ Timestamp: ${diagnosis.timestamp}`;
                
                if (window.jarvisMobile && window.jarvisMobile.showToast) {
                    window.jarvisMobile.showToast('📊 Diagnóstico executado - veja console');
                    console.log(report);
                } else {
                    alert(report);
                }
            }
        },
        
        // Diagnóstico básico se mobile não estiver disponível
        diagnose: async function() {
            const diagnosis = {
                environment: this.getEnvironment(),
                apiUrl: this.getApiUrl(),
                apiConnectivity: false,
                speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
                textToSpeech: 'speechSynthesis' in window,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                online: navigator.onLine,
                timestamp: new Date().toISOString()
            };
            
            // Testar API
            try {
                const response = await fetch(`${this.getApiUrl()}/health`, { timeout: 5000 });
                diagnosis.apiConnectivity = response.ok;
            } catch (error) {
                console.warn('API não acessível:', error);
            }
            
            console.log('📊 Diagnóstico mobile completo:', diagnosis);
            return diagnosis;
        }
    };
    
    // Salvar configuração atualizada
    try {
        localStorage.setItem('jarvisConfig', JSON.stringify(window.jarvisConfig));
        console.log('📱 Configuração mobile salva no localStorage');
    } catch (error) {
        console.warn('⚠️ Erro ao salvar configuração mobile:', error);
    }
    
    console.log('⚙️ JARVIS Mobile Config inicializado!');
    console.log('🌐 Ambiente:', window.jarvisConfig.getEnvironment());
    console.log('🔗 API URL:', window.jarvisConfig.getApiUrl());
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileConfig);
} else {
    initializeMobileConfig();
}
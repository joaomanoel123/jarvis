/**
 * Jarvis Text-to-Speech Module
 * Integração de voz para o assistente Jarvis
 * Compatível com GitHub Pages
 * 
 * Implementa tratamento robusto de erros baseado na Web Speech API SpeechSynthesisErrorEvent
 */

class JarvisTTS {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.isSupported = 'speechSynthesis' in window;
        this.isEnabled = true;
        this.isUnlocked = false; // Flag para controlar a ativação por gesto do usuário
        this.maxRetries = 3; // Será ajustado baseado no navegador
        this.retryDelay = 500; // Será ajustado baseado no navegador
        this.settings = {
            rate: 1.0,
            pitch: 1.0,
            volume: 0.8,
            voiceIndex: -1, // -1 = auto-select
            autoSpeak: true
        };
        
        this.init();
    }

    init() {
        console.log('🗣️ Inicializando Jarvis TTS...');
        
        if (!this.isSupported) {
            console.warn('❌ Text-to-Speech não suportado neste navegador');
            this.showBrowserCompatibilityInfo();
            return;
        }

        // Detectar navegador para otimizações específicas
        this.detectBrowser();
        
        // Carregar configurações salvas
        this.loadSettings();
        
        // Carregar vozes
        this.loadVoices();
        
        // Recarregar vozes quando disponíveis (alguns navegadores carregam assincronamente)
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
        
        // Configurar timeouts específicos do navegador
        this.setupBrowserSpecificSettings();

        // Adicionar controles de TTS à interface
        this.addTTSControls();
        
        console.log('✅ Jarvis TTS inicializado com sucesso');
        console.log('🔒 TTS aguardando interação do usuário para ativar.');
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;
        
        this.browserInfo = {
            isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
            isFirefox: /Firefox/.test(userAgent),
            isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
            isEdge: /Edge/.test(userAgent),
            isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent)
        };
        
        console.log('🌐 Navegador detectado:', this.browserInfo);
    }

    setupBrowserSpecificSettings() {
        // Configurações específicas para cada navegador
        if (this.browserInfo.isChrome) {
            // Chrome tem boa compatibilidade, usar configurações padrão
            this.maxRetries = 3;
            this.retryDelay = 500;
        } else if (this.browserInfo.isFirefox) {
            // Firefox pode ter problemas com vozes específicas
            this.maxRetries = 2;
            this.retryDelay = 800;
        } else if (this.browserInfo.isSafari) {
            // Safari tem limitações mais rígidas
            this.maxRetries = 1;
            this.retryDelay = 1000;
            // Safari pode precisar de configurações mais conservadoras
            this.settings.rate = Math.min(this.settings.rate, 1.5);
        } else if (this.browserInfo.isMobile) {
            // Dispositivos móveis podem ter limitações de recursos
            this.maxRetries = 2;
            this.retryDelay = 1000;
            this.settings.volume = Math.min(this.settings.volume, 0.8);
        }
    }

    showBrowserCompatibilityInfo() {
        const compatibleBrowsers = [
            '✅ Google Chrome (recomendado)',
            '✅ Mozilla Firefox',
            '✅ Microsoft Edge',
            '⚠️ Safari (funcionalidade limitada)',
            '❌ Internet Explorer (não suportado)'
        ];
        
        console.warn('📋 Compatibilidade de navegadores para Text-to-Speech:');
        compatibleBrowsers.forEach(browser => console.warn(browser));
    }

    unlockAudio() {
        if (this.isUnlocked || !this.isSupported) return;
        
        // Toca um som vazio para "acordar" a API em alguns navegadores
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        this.synth.speak(utterance);
        
        this.isUnlocked = true;
        console.log('🔊 Permissão de áudio concedida pelo usuário.');
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
        console.log(`🎤 ${this.voices.length} vozes carregadas`);
        
        // Auto-selecionar melhor voz em português
        if (this.settings.voiceIndex === -1) {
            this.autoSelectVoice();
        }
    }

    autoSelectVoice() {
        // Priorizar vozes em português brasileiro
        const ptBrVoices = this.voices.filter(voice => 
            voice.lang.includes('pt-BR') || voice.lang.includes('pt_BR')
        );
        
        // Se não encontrar pt-BR, procurar pt
        const ptVoices = this.voices.filter(voice => 
            voice.lang.startsWith('pt') && !voice.lang.includes('BR')
        );
        
        // Vozes em inglês como fallback
        const enVoices = this.voices.filter(voice => 
            voice.lang.startsWith('en')
        );

        let selectedVoice = null;
        
        if (ptBrVoices.length > 0) {
            // Preferir vozes femininas para Jarvis
            selectedVoice = ptBrVoices.find(v => v.name.toLowerCase().includes('female')) || ptBrVoices[0];
            console.log('🇧🇷 Voz selecionada: Português Brasileiro');
        } else if (ptVoices.length > 0) {
            selectedVoice = ptVoices.find(v => v.name.toLowerCase().includes('female')) || ptVoices[0];
            console.log('🇵🇹 Voz selecionada: Português');
        } else if (enVoices.length > 0) {
            selectedVoice = enVoices.find(v => v.name.toLowerCase().includes('female')) || enVoices[0];
            console.log('🇺🇸 Voz selecionada: Inglês (fallback)');
        }

        if (selectedVoice) {
            this.settings.voiceIndex = this.voices.indexOf(selectedVoice);
            console.log(`🎯 Voz auto-selecionada: ${selectedVoice.name} (${selectedVoice.lang})`);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('jarvis_tts_settings');
            if (saved) {
                try {
                    const parsedSettings = JSON.parse(saved);
                    this.settings = { ...this.settings, ...parsedSettings };
                    console.log('⚙️ Configurações TTS carregadas');
                } catch (parseError) {
                    console.warn('⚠️ Erro ao carregar configurações TTS, usando padrões:', parseError);
                    localStorage.removeItem('jarvis_tts_settings'); // Limpar configuração corrompida
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar configurações TTS:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('jarvis_tts_settings', JSON.stringify(this.settings));
            console.log('💾 Configurações TTS salvas');
        } catch (error) {
            console.warn('⚠️ Erro ao salvar configurações TTS:', error);
        }
    }

    speak(text, options = {}) {
        return this.speakWithRetry(text, options, 0);
    }

    speakWithRetry(text, options = {}, retryCount = 0) {
        if (!this.isSupported || !this.isEnabled || !text || !this.isUnlocked) {
            if (!this.isUnlocked) {
                console.warn('⚠️ Tentativa de falar antes da interação do usuário. A fala foi ignorada.');
            }
            return Promise.resolve();
        }

        // Limpar texto
        const cleanText = this.cleanText(text);
        if (!cleanText) {
            return Promise.resolve();
        }

        console.log(`🗣️ Falando (tentativa ${retryCount + 1}):`, cleanText);

        return new Promise((resolve, reject) => {
            // Garantir que a síntese não está pausada
            this.resume();

            // Parar qualquer fala anterior
            this.stop();

            // Criar nova utterance
            this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
            
            // Configurar voz
            if (this.settings.voiceIndex >= 0 && this.voices[this.settings.voiceIndex]) {
                this.currentUtterance.voice = this.voices[this.settings.voiceIndex];
            }

            // Aplicar configurações
            this.currentUtterance.rate = options.rate || this.settings.rate;
            this.currentUtterance.pitch = options.pitch || this.settings.pitch;
            this.currentUtterance.volume = options.volume || this.settings.volume;

            // Event listeners
            this.currentUtterance.onstart = () => {
                console.log('🎤 Iniciando fala...');
            };

            this.currentUtterance.onend = () => {
                console.log('✅ Fala concluída');
                this.currentUtterance = null;
                resolve();
            };

            // Implementar tratamento de erro robusto baseado na Web Speech API
            this.currentUtterance.addEventListener('error', (event) => {
                console.log('🔍 Detalhes do erro TTS:', {
                    error: event.error,
                    charIndex: event.charIndex,
                    elapsedTime: event.elapsedTime,
                    utterance: event.utterance
                });
                
                // Tratamento específico para diferentes tipos de erro
                switch (event.error) {
                    case 'audio-aborted':
                        console.warn('🟠 A fala foi interrompida (audio-aborted). Isso pode ser normal.');
                        this.currentUtterance = null;
                        resolve(); // Resolve a promessa para não travar a execução
                        break;
                        
                    case 'audio-busy':
                        console.warn('🟡 Sistema de áudio ocupado. Tentando novamente...');
                        this.currentUtterance = null;
                        
                        if (retryCount < this.maxRetries) {
                            setTimeout(() => {
                                this.speakWithRetry(cleanText, options, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, this.retryDelay);
                        } else {
                            reject(new Error('Sistema de áudio ocupado - máximo de tentativas excedido'));
                        }
                        break;
                        
                    case 'not-allowed':
                        console.error('🚫 Permissão de áudio negada pelo usuário.');
                        this.currentUtterance = null;
                        reject(new Error('Permissão de áudio necessária para Text-to-Speech'));
                        break;
                        
                    case 'network':
                        console.error('🌐 Erro de rede durante síntese de voz.');
                        this.currentUtterance = null;
                        reject(new Error('Erro de rede durante Text-to-Speech'));
                        break;
                        
                    case 'synthesis-unavailable':
                        console.error('❌ Síntese de voz não disponível.');
                        this.currentUtterance = null;
                        reject(new Error('Síntese de voz não disponível'));
                        break;
                        
                    case 'synthesis-failed':
                        console.error('💥 Falha na síntese de voz. Tentando com configurações alternativas...');
                        this.currentUtterance = null;
                        
                        if (retryCount < this.maxRetries) {
                            // Tentar com configurações mais conservadoras
                            const fallbackOptions = {
                                rate: Math.min(options.rate || this.settings.rate, 1.0),
                                pitch: 1.0, // Tom neutro
                                volume: Math.min(options.volume || this.settings.volume, 0.8)
                            };
                            
                            // Tentar com voz padrão do sistema
                            const originalVoiceIndex = this.settings.voiceIndex;
                            this.settings.voiceIndex = -1; // Usar voz padrão
                            
                            setTimeout(() => {
                                this.speakWithRetry(cleanText, fallbackOptions, retryCount + 1)
                                    .then(() => {
                                        console.log('✅ Síntese recuperada com configurações alternativas');
                                        this.settings.voiceIndex = originalVoiceIndex; // Restaurar configuração
                                        resolve();
                                    })
                                    .catch(() => {
                                        console.error('❌ Falha definitiva na síntese de voz');
                                        this.settings.voiceIndex = originalVoiceIndex; // Restaurar configuração
                                        reject(new Error('Falha na síntese de voz'));
                                    });
                            }, this.retryDelay);
                        } else {
                            reject(new Error('Falha na síntese de voz - máximo de tentativas excedido'));
                        }
                        break;
                        
                    case 'language-unavailable':
                        console.warn('🌍 Idioma não disponível. Tentando com voz padrão...');
                        this.currentUtterance = null;
                        
                        if (retryCount < this.maxRetries) {
                            // Tentar com a primeira voz disponível
                            const originalVoice = this.settings.voiceIndex;
                            this.settings.voiceIndex = 0;
                            
                            setTimeout(() => {
                                this.speakWithRetry(cleanText, options, retryCount + 1)
                                    .then(() => {
                                        console.log('✅ Síntese com voz alternativa bem-sucedida');
                                        this.settings.voiceIndex = originalVoice;
                                        resolve();
                                    })
                                    .catch(() => {
                                        this.settings.voiceIndex = originalVoice;
                                        reject(new Error('Idioma não disponível para síntese'));
                                    });
                            }, this.retryDelay);
                        } else {
                            reject(new Error('Idioma não disponível - máximo de tentativas excedido'));
                        }
                        break;
                        
                    case 'voice-unavailable':
                        console.warn('🎤 Voz selecionada não disponível. Usando voz padrão...');
                        this.currentUtterance = null;
                        
                        if (retryCount < this.maxRetries) {
                            // Resetar para auto-seleção
                            this.settings.voiceIndex = -1;
                            this.autoSelectVoice();
                            
                            setTimeout(() => {
                                this.speakWithRetry(cleanText, options, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, this.retryDelay);
                        } else {
                            reject(new Error('Voz não disponível - máximo de tentativas excedido'));
                        }
                        break;
                        
                    case 'text-too-long':
                        console.warn('📝 Texto muito longo. Dividindo em partes menores...');
                        this.currentUtterance = null;
                        
                        // Dividir texto em chunks menores
                        this.speakInChunks(cleanText, options)
                            .then(resolve)
                            .catch(reject);
                        break;
                        
                    case 'rate-not-supported':
                        console.warn('⚡ Taxa de velocidade não suportada. Usando velocidade padrão...');
                        this.currentUtterance = null;
                        
                        if (retryCount < this.maxRetries) {
                            const normalizedOptions = { ...options, rate: 1.0 };
                            setTimeout(() => {
                                this.speakWithRetry(cleanText, normalizedOptions, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, this.retryDelay);
                        } else {
                            reject(new Error('Taxa de velocidade não suportada - máximo de tentativas excedido'));
                        }
                        break;
                        
                    default:
                        console.error(`❌ Erro desconhecido na síntese de voz: ${event.error}`);
                        this.currentUtterance = null;
                        reject(new Error(`TTS Error: ${event.error}`));
                        break;
                }
            });

            // Iniciar fala
            this.synth.speak(this.currentUtterance);
        });
    }

    cleanText(text) {
        if (!text) return '';
        
        return text
            // Remover emojis comuns
            .replace(/[😀-🙏]/gu, '') // Emoticons
            .replace(/[🌀-🟿]/gu, '') // Misc Symbols
            .replace(/[🚀-🛿]/gu, '') // Transport
            .replace(/[🇠-🇿]/gu, '') // Flags
            .replace(/[☀-⛿]/gu, '')   // Misc symbols
            .replace(/[✀-➿]/gu, '')   // Dingbats
            // Remover símbolos especiais específicos
            .replace(/[🤖🗣️📱✅❌⚠️🔄🔍🎯📡📝🌊🔙💬🚫⏱️🔌🎆💾⚙️🎤]/g, '')
            // Limpar múltiplos espaços
            .replace(/\s+/g, ' ')
            // Remover quebras de linha
            .replace(/\n/g, ' ')
            .trim();
    }

    async speakInChunks(text, options = {}) {
        const maxChunkLength = 200; // Limite de caracteres por chunk
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks = [];
        
        let currentChunk = '';
        
        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (currentChunk.length + trimmedSentence.length + 1 <= maxChunkLength) {
                currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
            } else {
                if (currentChunk) {
                    chunks.push(currentChunk + '.');
                }
                currentChunk = trimmedSentence;
            }
        }
        
        if (currentChunk) {
            chunks.push(currentChunk + '.');
        }
        
        console.log(`📝 Dividindo texto em ${chunks.length} partes`);
        
        // Falar cada chunk sequencialmente
        for (let i = 0; i < chunks.length; i++) {
            console.log(`🗣️ Falando parte ${i + 1}/${chunks.length}`);
            await this.speak(chunks[i], options);
            
            // Pequena pausa entre chunks
            if (i < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }

    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
            this.currentUtterance = null;
            console.log('⏹️ Fala interrompida');
        }
    }

    pause() {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
            console.log('⏸️ Fala pausada');
        }
    }

    resume() {
        if (this.synth.paused) {
            this.synth.resume();
            console.log('▶️ Fala retomada');
        }
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        this.saveSettings();
        console.log(`🔊 TTS ${this.isEnabled ? 'ativado' : 'desativado'}`);
        
        if (!this.isEnabled) {
            this.stop();
        }
        
        this.updateTTSButton();
    }

    addTTSControls() {
        // Adicionar botão de toggle TTS
        const textInputDiv = document.getElementById('TextInput');
        if (textInputDiv) {
            const ttsBtn = document.createElement('button');
            ttsBtn.id = 'TTSBtn';
            ttsBtn.className = 'glow-on-hover';
            ttsBtn.innerHTML = '<i class="bi bi-volume-up"></i>';
            ttsBtn.title = 'Toggle Text-to-Speech';
            ttsBtn.onclick = () => this.toggle();
            
            textInputDiv.appendChild(ttsBtn);
            this.updateTTSButton();
        }

        // Adicionar configurações TTS ao menu de configurações
        this.addTTSSettings();
    }

    updateTTSButton() {
        const ttsBtn = document.getElementById('TTSBtn');
        if (ttsBtn) {
            const icon = ttsBtn.querySelector('i');
            if (this.isEnabled) {
                icon.className = 'bi bi-volume-up';
                ttsBtn.style.opacity = '1';
                ttsBtn.title = 'TTS Ativado - Clique para desativar';
            } else {
                icon.className = 'bi bi-volume-mute';
                ttsBtn.style.opacity = '0.5';
                ttsBtn.title = 'TTS Desativado - Clique para ativar';
            }
        }
    }

    addTTSSettings() {
        // Interceptar o clique do botão de configurações para adicionar opções TTS
        const originalSettingsHandler = window.jarvisSettingsHandler;
        
        window.jarvisSettingsHandler = () => {
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
                case '2':
                case '3':
                case '6':
                    // Chamar handler original para essas opções
                    if (originalSettingsHandler) {
                        originalSettingsHandler(choice);
                    }
                    break;
                case '4':
                    this.showTTSSettings();
                    break;
                case '5':
                    this.testTTS();
                    break;
                default:
                    return;
            }
        };
    }

    showTTSSettings() {
        if (!this.isSupported) {
            alert('❌ Text-to-Speech não é suportado neste navegador.');
            return;
        }

        const currentVoice = this.voices[this.settings.voiceIndex];
        const voiceName = currentVoice ? `${currentVoice.name} (${currentVoice.lang})` : 'Auto';
        
        const settings = [
            `🎤 Voz: ${voiceName}`,
            `⚡ Velocidade: ${this.settings.rate}`,
            `🎵 Tom: ${this.settings.pitch}`,
            `🔊 Volume: ${this.settings.volume}`,
            `🤖 Auto-falar: ${this.settings.autoSpeak ? 'Sim' : 'Não'}`,
            '🔄 Resetar configurações',
            '❌ Voltar'
        ];
        
        const choice = prompt(`Configurações de Voz:\n\n${settings.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nEscolha uma opção (1-${settings.length}):`);
        
        switch(choice) {
            case '1':
                this.selectVoice();
                break;
            case '2':
                this.adjustRate();
                break;
            case '3':
                this.adjustPitch();
                break;
            case '4':
                this.adjustVolume();
                break;
            case '5':
                this.toggleAutoSpeak();
                break;
            case '6':
                this.resetSettings();
                break;
            default:
                return;
        }
    }

    selectVoice() {
        if (this.voices.length === 0) {
            alert('❌ Nenhuma voz disponível.');
            return;
        }

        const voiceOptions = this.voices.map((voice, index) => 
            `${index + 1}. ${voice.name} (${voice.lang})${voice.default ? ' [Padrão]' : ''}`
        );
        
        const choice = prompt(`Selecione uma voz:\n\n${voiceOptions.join('\n')}\n\nDigite o número da voz (1-${this.voices.length}):`);
        
        const voiceIndex = parseInt(choice) - 1;
        if (voiceIndex >= 0 && voiceIndex < this.voices.length) {
            this.settings.voiceIndex = voiceIndex;
            this.saveSettings();
            alert(`✅ Voz selecionada: ${this.voices[voiceIndex].name}`);
            this.testTTS();
        }
    }

    adjustRate() {
        const newRate = prompt(`Velocidade da fala (0.1 - 2.0):\n\nAtual: ${this.settings.rate}\n\nDigite a nova velocidade:`, this.settings.rate);
        const rate = parseFloat(newRate);
        
        if (!isNaN(rate) && rate >= 0.1 && rate <= 2.0) {
            this.settings.rate = rate;
            this.saveSettings();
            alert(`✅ Velocidade ajustada para: ${rate}`);
            this.testTTS();
        } else if (newRate !== null) {
            alert('❌ Valor inválido. Use um número entre 0.1 e 2.0');
        }
    }

    adjustPitch() {
        const newPitch = prompt(`Tom da voz (0.0 - 2.0):\n\nAtual: ${this.settings.pitch}\n\nDigite o novo tom:`, this.settings.pitch);
        const pitch = parseFloat(newPitch);
        
        if (!isNaN(pitch) && pitch >= 0.0 && pitch <= 2.0) {
            this.settings.pitch = pitch;
            this.saveSettings();
            alert(`✅ Tom ajustado para: ${pitch}`);
            this.testTTS();
        } else if (newPitch !== null) {
            alert('❌ Valor inválido. Use um número entre 0.0 e 2.0');
        }
    }

    adjustVolume() {
        const newVolume = prompt(`Volume da voz (0.0 - 1.0):\n\nAtual: ${this.settings.volume}\n\nDigite o novo volume:`, this.settings.volume);
        const volume = parseFloat(newVolume);
        
        if (!isNaN(volume) && volume >= 0.0 && volume <= 1.0) {
            this.settings.volume = volume;
            this.saveSettings();
            alert(`✅ Volume ajustado para: ${volume}`);
            this.testTTS();
        } else if (newVolume !== null) {
            alert('❌ Valor inválido. Use um número entre 0.0 e 1.0');
        }
    }

    toggleAutoSpeak() {
        this.settings.autoSpeak = !this.settings.autoSpeak;
        this.saveSettings();
        alert(`✅ Auto-falar ${this.settings.autoSpeak ? 'ativado' : 'desativado'}`);
    }

    resetSettings() {
        if (confirm('🔄 Resetar todas as configurações de voz para o padrão?')) {
            this.settings = {
                rate: 1.0,
                pitch: 1.0,
                volume: 0.8,
                voiceIndex: -1,
                autoSpeak: true
            };
            this.autoSelectVoice();
            this.saveSettings();
            alert('✅ Configurações resetadas!');
        }
    }

    testTTS() {
        const testPhrases = [
            'Olá! Eu sou o Jarvis, seu assistente virtual.',
            'Sistema de voz funcionando perfeitamente.',
            'Como posso ajudá-lo hoje?',
            'Todos os sistemas operacionais.'
        ];
        
        const randomPhrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];
        this.speak(randomPhrase)
            .then(() => {
                console.log('✅ Teste TTS concluído com sucesso');
            })
            .catch((error) => {
                console.error('❌ Falha no teste TTS:', error);
                this.diagnoseTTSIssues();
            });
    }

    diagnoseTTSIssues() {
        console.log('🔍 Iniciando diagnóstico do sistema TTS...');
        
        const diagnostics = {
            speechSynthesisSupported: 'speechSynthesis' in window,
            voicesAvailable: this.voices.length,
            currentVoice: this.voices[this.settings.voiceIndex]?.name || 'Nenhuma',
            isUnlocked: this.isUnlocked,
            isEnabled: this.isEnabled,
            isSpeaking: this.synth.speaking,
            isPaused: this.synth.paused,
            settings: this.settings
        };
        
        console.table(diagnostics);
        
        // Sugestões baseadas no diagnóstico
        const suggestions = [];
        
        if (!diagnostics.speechSynthesisSupported) {
            suggestions.push('❌ Navegador não suporta Web Speech API');
        }
        
        if (diagnostics.voicesAvailable === 0) {
            suggestions.push('🎤 Nenhuma voz disponível - recarregue a página');
        }
        
        if (!diagnostics.isUnlocked) {
            suggestions.push('🔒 Sistema TTS não foi desbloqueado - clique em qualquer lugar da página');
        }
        
        if (!diagnostics.isEnabled) {
            suggestions.push('🔇 TTS está desabilitado - ative nas configurações');
        }
        
        if (diagnostics.isSpeaking) {
            suggestions.push('🗣️ Sistema já está falando - aguarde ou pare a fala atual');
        }
        
        if (suggestions.length > 0) {
            console.warn('💡 Sugestões para resolver problemas TTS:');
            suggestions.forEach(suggestion => console.warn(suggestion));
        } else {
            console.log('✅ Sistema TTS parece estar funcionando corretamente');
        }
        
        return diagnostics;
    }

    // Método para recuperação automática de erros
    async recoverFromError() {
        console.log('🔄 Tentando recuperar sistema TTS...');
        
        // Parar qualquer síntese em andamento
        this.stop();
        
        // Recarregar vozes
        this.loadVoices();
        
        // Auto-selecionar voz novamente
        this.autoSelectVoice();
        
        // Tentar um teste simples
        try {
            await this.speak('Sistema recuperado');
            console.log('✅ Sistema TTS recuperado com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Falha na recuperação do sistema TTS:', error);
            return false;
        }
    }

    // Método público para ser chamado pelo main.js
    speakResponse(text) {
        if (this.settings.autoSpeak && this.isEnabled) {
            this.speak(text);
        }
    }
}

// Inicializar TTS quando o documento estiver pronto
let jarvisTTS = null;

$(document).ready(function() {
    // Aguardar um pouco para garantir que tudo foi carregado
    setTimeout(() => {
        jarvisTTS = new JarvisTTS();
        
        // Tornar disponível globalmente
        window.jarvisTTS = jarvisTTS;
        
        // Adicionar um listener de evento único para desbloquear o áudio na primeira interação do usuário
        $(document).one('click keydown', () => {
            if (jarvisTTS) {
                jarvisTTS.unlockAudio();
            }
        });
        
        console.log('🎤 Jarvis TTS integrado com sucesso!');
    }, 1000);
});

// Exportar para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JarvisTTS;
}
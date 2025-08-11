/**
 * Jarvis Text-to-Speech Module
 * Integração de voz para o assistente Jarvis
 * Compatível com GitHub Pages
 */

class JarvisTTS {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.isSupported = 'speechSynthesis' in window;
        this.isEnabled = true;
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
            return;
        }

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

        // Adicionar controles de TTS à interface
        this.addTTSControls();
        
        console.log('✅ Jarvis TTS inicializado com sucesso');
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
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                console.log('⚙️ Configurações TTS carregadas');
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
        if (!this.isSupported || !this.isEnabled || !text) {
            return Promise.resolve();\n        }\n\n        // Limpar texto\n        const cleanText = this.cleanText(text);\n        if (!cleanText) {\n            return Promise.resolve();\n        }\n\n        console.log('🗣️ Falando:', cleanText);\n\n        return new Promise((resolve, reject) => {\n            // Parar qualquer fala anterior\n            this.stop();\n\n            // Criar nova utterance\n            this.currentUtterance = new SpeechSynthesisUtterance(cleanText);\n            \n            // Configurar voz\n            if (this.settings.voiceIndex >= 0 && this.voices[this.settings.voiceIndex]) {\n                this.currentUtterance.voice = this.voices[this.settings.voiceIndex];\n            }\n\n            // Aplicar configurações\n            this.currentUtterance.rate = options.rate || this.settings.rate;\n            this.currentUtterance.pitch = options.pitch || this.settings.pitch;\n            this.currentUtterance.volume = options.volume || this.settings.volume;\n\n            // Event listeners\n            this.currentUtterance.onstart = () => {\n                console.log('🎤 Iniciando fala...');\n            };\n\n            this.currentUtterance.onend = () => {\n                console.log('✅ Fala concluída');\n                this.currentUtterance = null;\n                resolve();\n            };\n\n            this.currentUtterance.onerror = (event) => {\n                console.error('❌ Erro na fala:', event.error);\n                this.currentUtterance = null;\n                reject(new Error(`TTS Error: ${event.error}`));\n            };\n\n            // Iniciar fala\n            this.synth.speak(this.currentUtterance);\n        });\n    }\n\n    cleanText(text) {\n        if (!text) return '';\n        \n        return text\n            // Remover emojis\n            .replace(/[\\u{1F600}-\\u{1F64F}]|[\\u{1F300}-\\u{1F5FF}]|[\\u{1F680}-\\u{1F6FF}]|[\\u{1F1E0}-\\u{1F1FF}]|[\\u{2600}-\\u{26FF}]|[\\u{2700}-\\u{27BF}]/gu, '')\n            // Remover símbolos especiais\n            .replace(/[🤖🗣️📱✅❌⚠️🔄🔍🎯📡📝🌊🔙💬🚫⏱️🔌🎆💾⚙️🎤]/g, '')\n            // Limpar múltiplos espaços\n            .replace(/\\s+/g, ' ')\n            // Remover quebras de linha\n            .replace(/\\n/g, ' ')\n            .trim();\n    }\n\n    stop() {\n        if (this.synth.speaking) {\n            this.synth.cancel();\n            this.currentUtterance = null;\n            console.log('⏹️ Fala interrompida');\n        }\n    }\n\n    pause() {\n        if (this.synth.speaking && !this.synth.paused) {\n            this.synth.pause();\n            console.log('⏸️ Fala pausada');\n        }\n    }\n\n    resume() {\n        if (this.synth.paused) {\n            this.synth.resume();\n            console.log('▶️ Fala retomada');\n        }\n    }\n\n    toggle() {\n        this.isEnabled = !this.isEnabled;\n        this.saveSettings();\n        console.log(`🔊 TTS ${this.isEnabled ? 'ativado' : 'desativado'}`);\n        \n        if (!this.isEnabled) {\n            this.stop();\n        }\n        \n        this.updateTTSButton();\n    }\n\n    addTTSControls() {\n        // Adicionar botão de toggle TTS\n        const textInputDiv = document.getElementById('TextInput');\n        if (textInputDiv) {\n            const ttsBtn = document.createElement('button');\n            ttsBtn.id = 'TTSBtn';\n            ttsBtn.className = 'glow-on-hover';\n            ttsBtn.innerHTML = '<i class=\"bi bi-volume-up\"></i>';\n            ttsBtn.title = 'Toggle Text-to-Speech';\n            ttsBtn.onclick = () => this.toggle();\n            \n            textInputDiv.appendChild(ttsBtn);\n            this.updateTTSButton();\n        }\n\n        // Adicionar configurações TTS ao menu de configurações\n        this.addTTSSettings();\n    }\n\n    updateTTSButton() {\n        const ttsBtn = document.getElementById('TTSBtn');\n        if (ttsBtn) {\n            const icon = ttsBtn.querySelector('i');\n            if (this.isEnabled) {\n                icon.className = 'bi bi-volume-up';\n                ttsBtn.style.opacity = '1';\n                ttsBtn.title = 'TTS Ativado - Clique para desativar';\n            } else {\n                icon.className = 'bi bi-volume-mute';\n                ttsBtn.style.opacity = '0.5';\n                ttsBtn.title = 'TTS Desativado - Clique para ativar';\n            }\n        }\n    }\n\n    addTTSSettings() {\n        // Interceptar o clique do botão de configurações para adicionar opções TTS\n        const originalSettingsHandler = window.jarvisSettingsHandler;\n        \n        window.jarvisSettingsHandler = () => {\n            const options = [\n                '🔧 Configurar URL da API',\n                '🧪 Testar conexão',\n                '💬 Teste rápido de mensagem',\n                '🗣️ Configurações de Voz',\n                '🎤 Testar Text-to-Speech',\n                '📊 Ver logs do console',\n                '❌ Cancelar'\n            ];\n            \n            const choice = prompt(`Configurações do Jarvis:\\n\\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\\n')}\\n\\nEscolha uma opção (1-${options.length}):`);\n            \n            switch(choice) {\n                case '1':\n                case '2':\n                case '3':\n                case '6':\n                    // Chamar handler original para essas opções\n                    if (originalSettingsHandler) {\n                        originalSettingsHandler(choice);\n                    }\n                    break;\n                case '4':\n                    this.showTTSSettings();\n                    break;\n                case '5':\n                    this.testTTS();\n                    break;\n                default:\n                    return;\n            }\n        };\n    }\n\n    showTTSSettings() {\n        if (!this.isSupported) {\n            alert('❌ Text-to-Speech não é suportado neste navegador.');\n            return;\n        }\n\n        const currentVoice = this.voices[this.settings.voiceIndex];\n        const voiceName = currentVoice ? `${currentVoice.name} (${currentVoice.lang})` : 'Auto';\n        \n        const settings = [\n            `🎤 Voz: ${voiceName}`,\n            `⚡ Velocidade: ${this.settings.rate}`,\n            `🎵 Tom: ${this.settings.pitch}`,\n            `🔊 Volume: ${this.settings.volume}`,\n            `🤖 Auto-falar: ${this.settings.autoSpeak ? 'Sim' : 'Não'}`,\n            '🔄 Resetar configurações',\n            '❌ Voltar'\n        ];\n        \n        const choice = prompt(`Configurações de Voz:\\n\\n${settings.map((opt, i) => `${i + 1}. ${opt}`).join('\\n')}\\n\\nEscolha uma opção (1-${settings.length}):`);\n        \n        switch(choice) {\n            case '1':\n                this.selectVoice();\n                break;\n            case '2':\n                this.adjustRate();\n                break;\n            case '3':\n                this.adjustPitch();\n                break;\n            case '4':\n                this.adjustVolume();\n                break;\n            case '5':\n                this.toggleAutoSpeak();\n                break;\n            case '6':\n                this.resetSettings();\n                break;\n            default:\n                return;\n        }\n    }\n\n    selectVoice() {\n        if (this.voices.length === 0) {\n            alert('❌ Nenhuma voz disponível.');\n            return;\n        }\n\n        const voiceOptions = this.voices.map((voice, index) => \n            `${index + 1}. ${voice.name} (${voice.lang})${voice.default ? ' [Padrão]' : ''}`\n        );\n        \n        const choice = prompt(`Selecione uma voz:\\n\\n${voiceOptions.join('\\n')}\\n\\nDigite o número da voz (1-${this.voices.length}):`);\n        \n        const voiceIndex = parseInt(choice) - 1;\n        if (voiceIndex >= 0 && voiceIndex < this.voices.length) {\n            this.settings.voiceIndex = voiceIndex;\n            this.saveSettings();\n            alert(`✅ Voz selecionada: ${this.voices[voiceIndex].name}`);\n            this.testTTS();\n        }\n    }\n\n    adjustRate() {\n        const newRate = prompt(`Velocidade da fala (0.1 - 2.0):\\n\\nAtual: ${this.settings.rate}\\n\\nDigite a nova velocidade:`, this.settings.rate);\n        const rate = parseFloat(newRate);\n        \n        if (!isNaN(rate) && rate >= 0.1 && rate <= 2.0) {\n            this.settings.rate = rate;\n            this.saveSettings();\n            alert(`✅ Velocidade ajustada para: ${rate}`);\n            this.testTTS();\n        } else if (newRate !== null) {\n            alert('❌ Valor inválido. Use um número entre 0.1 e 2.0');\n        }\n    }\n\n    adjustPitch() {\n        const newPitch = prompt(`Tom da voz (0.0 - 2.0):\\n\\nAtual: ${this.settings.pitch}\\n\\nDigite o novo tom:`, this.settings.pitch);\n        const pitch = parseFloat(newPitch);\n        \n        if (!isNaN(pitch) && pitch >= 0.0 && pitch <= 2.0) {\n            this.settings.pitch = pitch;\n            this.saveSettings();\n            alert(`✅ Tom ajustado para: ${pitch}`);\n            this.testTTS();\n        } else if (newPitch !== null) {\n            alert('❌ Valor inválido. Use um número entre 0.0 e 2.0');\n        }\n    }\n\n    adjustVolume() {\n        const newVolume = prompt(`Volume da voz (0.0 - 1.0):\\n\\nAtual: ${this.settings.volume}\\n\\nDigite o novo volume:`, this.settings.volume);\n        const volume = parseFloat(newVolume);\n        \n        if (!isNaN(volume) && volume >= 0.0 && volume <= 1.0) {\n            this.settings.volume = volume;\n            this.saveSettings();\n            alert(`✅ Volume ajustado para: ${volume}`);\n            this.testTTS();\n        } else if (newVolume !== null) {\n            alert('❌ Valor inválido. Use um número entre 0.0 e 1.0');\n        }\n    }\n\n    toggleAutoSpeak() {\n        this.settings.autoSpeak = !this.settings.autoSpeak;\n        this.saveSettings();\n        alert(`✅ Auto-falar ${this.settings.autoSpeak ? 'ativado' : 'desativado'}`);\n    }\n\n    resetSettings() {\n        if (confirm('🔄 Resetar todas as configurações de voz para o padrão?')) {\n            this.settings = {\n                rate: 1.0,\n                pitch: 1.0,\n                volume: 0.8,\n                voiceIndex: -1,\n                autoSpeak: true\n            };\n            this.autoSelectVoice();\n            this.saveSettings();\n            alert('✅ Configurações resetadas!');\n        }\n    }\n\n    testTTS() {\n        const testPhrases = [\n            'Olá! Eu sou o Jarvis, seu assistente virtual.',\n            'Sistema de voz funcionando perfeitamente.',\n            'Como posso ajudá-lo hoje?',\n            'Todos os sistemas operacionais.'\n        ];\n        \n        const randomPhrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];\n        this.speak(randomPhrase);\n    }\n\n    // Método público para ser chamado pelo main.js\n    speakResponse(text) {\n        if (this.settings.autoSpeak && this.isEnabled) {\n            this.speak(text);\n        }\n    }\n}\n\n// Inicializar TTS quando o documento estiver pronto\nlet jarvisTTS = null;\n\n$(document).ready(function() {\n    // Aguardar um pouco para garantir que tudo foi carregado\n    setTimeout(() => {\n        jarvisTTS = new JarvisTTS();\n        \n        // Tornar disponível globalmente\n        window.jarvisTTS = jarvisTTS;\n        \n        console.log('🎤 Jarvis TTS integrado com sucesso!');\n    }, 1000);\n});\n\n// Exportar para uso em outros scripts\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = JarvisTTS;\n}\n"
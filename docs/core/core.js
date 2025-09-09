/**
 * JARVIS CORE - Sistema Principal
 * Centraliza toda a lógica de negócio e coordena módulos
 */

class JarvisCore {
    constructor(config = {}) {
        // Configurações
        this.config = {
            debugMode: false,
            language: 'pt-BR',
            voiceSettings: {
                rate: 1,
                pitch: 1,
                volume: 0.8
            },
            commands: [],
            ...config
        };

        // Estado da aplicação
        this.state = {
            isListening: false,
            isProcessing: false,
            isSpeaking: false,
            lastCommand: null,
            sessionId: this.generateSessionId(),
            startTime: Date.now()
        };

        // Módulos conectados
        this.modules = {
            speech: null,
            tts: null,
            ui: null
        };

        // Sistema de comandos
        this.commandsMap = new Map();
        
        // Sistema de eventos
        this.eventListeners = new Map();
        
        // Cache para respostas
        this.responseCache = new Map();

        // Log de atividades
        this.activityLog = [];

        this.log('🔧 JARVIS Core inicializado');
    }

    /**
     * INICIALIZAÇÃO
     */
    async init() {
        try {
            this.log('🚀 Inicializando JARVIS Core...');

            // Carregar comandos padrão
            await this.loadCommands();
            
            // Configurar sistema de eventos
            this.setupEventSystem();
            
            // Inicializar cache
            this.initializeCache();
            
            // Registrar comandos básicos
            this.registerDefaultCommands();
            
            this.state.isInitialized = true;
            this.log('✅ JARVIS Core inicializado com sucesso');
            
            return true;

        } catch (error) {
            this.error('❌ Erro na inicialização do Core:', error);
            throw error;
        }
    }

    /**
     * SISTEMA DE EVENTOS
     */
    setupEventSystem() {
        // Eventos personalizados para comunicação entre módulos
        this.events = {
            COMMAND_RECEIVED: 'jarvis:command:received',
            COMMAND_PROCESSED: 'jarvis:command:processed',
            SPEECH_START: 'jarvis:speech:start',
            SPEECH_END: 'jarvis:speech:end',
            LISTENING_START: 'jarvis:listening:start',
            LISTENING_END: 'jarvis:listening:end',
            ERROR_OCCURRED: 'jarvis:error:occurred',
            STATE_CHANGED: 'jarvis:state:changed'
        };
    }

    /**
     * CARREGAR COMANDOS
     */
    async loadCommands() {
        try {
            const response = await fetch('./data/commands.json');
            const commandsData = await response.json();
            
            commandsData.commands.forEach(cmd => {
                this.registerCommand(cmd);
            });

            this.log(`📋 Carregados ${commandsData.commands.length} comandos`);

        } catch (error) {
            this.log('⚠️ Usando comandos padrão (arquivo commands.json não encontrado)');
            this.loadDefaultCommands();
        }
    }

    /**
     * COMANDOS PADRÃO
     */
    loadDefaultCommands() {
        const defaultCommands = [
            {
                name: 'saudar',
                patterns: ['olá', 'oi', 'hey jarvis', 'bom dia', 'boa tarde', 'boa noite'],
                action: 'greeting',
                responses: [
                    'Olá! Como posso ajudá-lo?',
                    'Oi! Estou aqui para ajudar.',
                    'Saudações! O que você precisa?'
                ]
            },
            {
                name: 'hora',
                patterns: ['que horas são', 'horário atual', 'me diga a hora'],
                action: 'time',
                responses: ['Agora são {time}']
            },
            {
                name: 'data',
                patterns: ['que dia é hoje', 'data atual', 'qual a data'],
                action: 'date',
                responses: ['Hoje é {date}']
            },
            {
                name: 'clima',
                patterns: ['como está o tempo', 'previsão do tempo', 'clima hoje'],
                action: 'weather',
                responses: ['Verificando informações do clima...']
            },
            {
                name: 'calculadora',
                patterns: ['calcule', 'quanto é', 'soma', 'subtração', 'multiplicação', 'divisão'],
                action: 'calculate',
                responses: ['O resultado é {result}']
            },
            {
                name: 'despedida',
                patterns: ['tchau', 'até logo', 'adeus', 'até mais'],
                action: 'goodbye',
                responses: [
                    'Até logo! Foi um prazer ajudá-lo.',
                    'Tchau! Estarei aqui quando precisar.',
                    'Até mais! Volte sempre.'
                ]
            }
        ];

        defaultCommands.forEach(cmd => this.registerCommand(cmd));
    }

    /**
     * REGISTRAR COMANDOS
     */
    registerCommand(command) {
        // Validar estrutura do comando
        if (!command.name || !command.patterns || !command.action) {
            this.error('Comando inválido:', command);
            return false;
        }

        // Registrar cada padrão
        command.patterns.forEach(pattern => {
            const normalizedPattern = this.normalizeText(pattern);
            this.commandsMap.set(normalizedPattern, command);
        });

        this.log(`🔗 Comando registrado: ${command.name}`);
        return true;
    }

    /**
     * PROCESSAR COMANDO DE VOZ
     */
    async processVoiceCommand(text) {
        if (!text || typeof text !== 'string') {
            return this.createResponse('Não consegui entender o comando.');
        }

        this.setState({ isProcessing: true, lastCommand: text });
        this.emit(this.events.COMMAND_RECEIVED, { text, timestamp: Date.now() });

        try {
            // Normalizar texto
            const normalizedText = this.normalizeText(text);
            this.log(`🎤 Processando comando: "${text}"`);

            // Encontrar comando correspondente
            const command = this.findMatchingCommand(normalizedText);
            
            if (command) {
                // Executar ação do comando
                const response = await this.executeCommand(command, text);
                this.emit(this.events.COMMAND_PROCESSED, { command, response });
                return response;
            } else {
                // Comando não reconhecido
                return this.handleUnknownCommand(text);
            }

        } catch (error) {
            this.error('Erro ao processar comando:', error);
            return this.createErrorResponse();
        } finally {
            this.setState({ isProcessing: false });
        }
    }

    /**
     * ENCONTRAR COMANDO CORRESPONDENTE
     */
    findMatchingCommand(text) {
        // Busca exata primeiro
        if (this.commandsMap.has(text)) {
            return this.commandsMap.get(text);
        }

        // Busca por similaridade
        for (let [pattern, command] of this.commandsMap.entries()) {
            if (this.calculateSimilarity(text, pattern) > 0.7) {
                return command;
            }
        }

        // Busca por palavras-chave
        for (let [pattern, command] of this.commandsMap.entries()) {
            if (this.containsKeywords(text, pattern)) {
                return command;
            }
        }

        return null;
    }

    /**
     * EXECUTAR COMANDO
     */
    async executeCommand(command, originalText) {
        this.log(`⚡ Executando: ${command.name}`);

        switch (command.action) {
            case 'greeting':
                return this.createResponse(this.getRandomResponse(command.responses));

            case 'time':
                const time = this.getCurrentTime();
                return this.createResponse(
                    command.responses[0].replace('{time}', time)
                );

            case 'date':
                const date = this.getCurrentDate();
                return this.createResponse(
                    command.responses[0].replace('{date}', date)
                );

            case 'weather':
                return await this.getWeatherInfo();

            case 'calculate':
                return this.calculateExpression(originalText);

            case 'goodbye':
                return this.createResponse(this.getRandomResponse(command.responses));

            default:
                if (command.customAction && typeof command.customAction === 'function') {
                    return await command.customAction(originalText);
                }
                return this.createResponse(this.getRandomResponse(command.responses));
        }
    }

    /**
     * UTILITÁRIOS PARA COMANDOS
     */
    getCurrentTime() {
        return new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getCurrentDate() {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async getWeatherInfo() {
        // Simulação - em produção, usar API real
        const conditions = ['ensolarado', 'nublado', 'chuvoso', 'parcialmente nublado'];
        const temps = ['22°C', '25°C', '18°C', '28°C'];
        
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = temps[Math.floor(Math.random() * temps.length)];
        
        return this.createResponse(
            `O tempo está ${condition} com temperatura de ${temp}.`
        );
    }

    calculateExpression(text) {
        try {
            // Extrair expressão matemática do texto
            const expression = this.extractMathExpression(text);
            if (expression) {
                const result = Function(`"use strict"; return (${expression})`)();
                return this.createResponse(`O resultado é ${result}`);
            }
        } catch (error) {
            this.log('Erro no cálculo:', error);
        }
        
        return this.createResponse('Não consegui realizar esse cálculo. Tente novamente.');
    }

    extractMathExpression(text) {
        // Substituir palavras por operadores
        let expression = text.toLowerCase()
            .replace(/mais|soma|somar/g, '+')
            .replace(/menos|subtrai|subtrair/g, '-')
            .replace(/vezes|multiplicar|multiplica/g, '*')
            .replace(/dividir|dividi|divisão/g, '/');

        // Extrair números e operadores
        const mathPattern = /[\d+\-*/().\s]+/g;
        const matches = expression.match(mathPattern);
        
        if (matches && matches.length > 0) {
            return matches[0].trim();
        }
        
        return null;
    }

    /**
     * SISTEMA DE TEXTO
     */
    normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^\w\s]/g, '') // Remove pontuação
            .trim();
    }

    calculateSimilarity(text1, text2) {
        // Algoritmo simples de similaridade (Jaccard)
        const words1 = new Set(text1.split(' '));
        const words2 = new Set(text2.split(' '));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    containsKeywords(text, pattern) {
        const textWords = text.split(' ');
        const patternWords = pattern.split(' ');
        
        return patternWords.some(word => 
            textWords.some(textWord => textWord.includes(word))
        );
    }

    /**
     * SISTEMA DE RESPOSTAS
     */
    createResponse(text, options = {}) {
        return {
            text,
            timestamp: Date.now(),
            sessionId: this.state.sessionId,
            type: options.type || 'response',
            data: options.data || null
        };
    }

    createErrorResponse(error = null) {
        return this.createResponse(
            'Desculpe, ocorreu um erro ao processar sua solicitação.',
            { type: 'error', data: error }
        );
    }

    handleUnknownCommand(text) {
        const suggestions = [
            'Não entendi esse comando. Tente: "que horas são", "como está o tempo" ou "olá".',
            'Comando não reconhecido. Precisa de ajuda? Diga "ajuda" para ver os comandos disponíveis.',
            'Desculpe, não consegui entender. Pode repetir de forma diferente?'
        ];

        return this.createResponse(this.getRandomResponse(suggestions));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * SISTEMA DE ESTADO
     */
    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        
        this.emit(this.events.STATE_CHANGED, { oldState, newState: this.state });
    }

    getState() {
        return { ...this.state };
    }

    /**
     * SISTEMA DE EVENTOS
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.error('Erro em event listener:', error);
                }
            });
        }
    }

    /**
     * CONECTAR MÓDULOS
     */
    connectModule(moduleName, moduleInstance) {
        this.modules[moduleName] = moduleInstance;
        this.log(`🔗 Módulo conectado: ${moduleName}`);
    }

    /**
     * CACHE
     */
    initializeCache() {
        // Cache com TTL de 5 minutos
        this.cacheTTL = 5 * 60 * 1000;
    }

    getCacheKey(command) {
        return `cmd_${command}_${this.state.sessionId}`;
    }

    /**
     * UTILITÁRIOS
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    log(message, data = null) {
        if (this.config.debugMode) {
            console.log(`[JARVIS Core] ${message}`, data || '');
        }
        
        this.activityLog.push({
            timestamp: Date.now(),
            message,
            data,
            type: 'info'
        });
    }

    error(message, error = null) {
        console.error(`[JARVIS Core] ${message}`, error || '');
        
        this.activityLog.push({
            timestamp: Date.now(),
            message,
            error,
            type: 'error'
        });

        this.emit(this.events.ERROR_OCCURRED, { message, error });
    }

    /**
     * CLEANUP
     */
    cleanup() {
        this.log('🧹 Limpando JARVIS Core...');
        
        this.eventListeners.clear();
        this.commandsMap.clear();
        this.responseCache.clear();
        this.activityLog = [];
        
        this.state.isInitialized = false;
    }

    /**
     * API PÚBLICA
     */
    getStats() {
        return {
            sessionId: this.state.sessionId,
            uptime: Date.now() - this.state.startTime,
            commandsRegistered: this.commandsMap.size,
            activityCount: this.activityLog.length,
            cacheSize: this.responseCache.size
        };
    }

    getAvailableCommands() {
        const commands = [];
        const processed = new Set();
        
        for (let [pattern, command] of this.commandsMap.entries()) {
            if (!processed.has(command.name)) {
                commands.push({
                    name: command.name,
                    patterns: command.patterns,
                    description: command.description || 'Sem descrição disponível'
                });
                processed.add(command.name);
            }
        }
        
        return commands;
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JarvisCore;
} else {
    window.JarvisCore = JarvisCore;
}
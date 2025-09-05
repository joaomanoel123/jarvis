/**
 * ui.js
 * 
 * Módulo responsável por toda a manipulação do DOM (Document Object Model).
 * Ele abstrai a complexidade da interface, fornecendo funções simples para controlar o que o usuário vê.
 * Nenhum outro módulo deve interagir diretamente com o HTML.
 */

import { initSiriWave } from 'js/siriwave.js';

// Mapeamento dos seletores do DOM para fácil acesso e manutenção
const SELECTORS = {
    loadingScreen: '#loadingScreen',
    startSection: '#Start',
    ovalSection: '#Oval',
    siriWaveSection: '#SiriWave',
    wishMessage: '#WishMessage',
    chatbox: '#chatbox',
    micBtn: '#MicBtn',
    sendBtn: '#SendBtn',
    settingsBtn: '#SettingsBtn',
    chatBtn: '#ChatBtn',
    chatCanvasBody: '#chat-canvas-body',
    loader: '#Loader',
    faceAuth: '#FaceAuth',
    faceAuthSuccess: '#FaceAuthSuccess',
    helloGreet: '#HelloGreet'
};

// Armazena as instâncias dos elementos e da SiriWave
const elements = {};
let siriWave = null;

/**
 * Inicializa o módulo da UI, fazendo cache dos elementos do DOM e da SiriWave.
 */
export function initUI() {
    for (const key in SELECTORS) {
        elements[key] = $(SELECTORS[key]);
    }
    siriWave = initSiriWave('#siri-container');
    console.log('✅ UI Module Initialized');
}

/**
 * Vincula as funções de callback aos eventos dos elementos da interface.
 * @param {object} listeners - Um objeto contendo as funções a serem chamadas para cada evento.
 * Ex: { onMicClick: () => {...}, onSendClick: () => {...} }
 */
export function setupEventListeners(listeners) {
    elements.micBtn.on('click', listeners.onMicClick);
    elements.sendBtn.on('click', listeners.onSendClick);
    elements.settingsBtn.on('click', listeners.onSettingsClick);

    elements.chatbox.on('keyup', (e) => {
        const message = elements.chatbox.val();
        if (message.length > 0) {
            elements.micBtn.hide();
            elements.sendBtn.show();
        } else {
            elements.micBtn.show();
            elements.sendBtn.hide();
        }
        if (e.which === 13) {
            listeners.onSendClick();
        }
    });
    console.log('✅ Event Listeners Setup');
}

/**
 * Atualiza a mensagem principal exibida na tela.
 * @param {string} text - O texto a ser exibido.
 */
export function updateWishMessage(text) {
    elements.wishMessage.text(text);
}

/**
 * Adiciona uma mensagem ao painel de chat.
 * @param {string} message - O conteúdo da mensagem.
 * @param {'sender' | 'receiver'} type - O tipo de mensagem ('sender' ou 'receiver').
 */
export function addChatMessage(message, type) {
    const messageClass = type === 'sender' ? 'sender_message' : 'receiver_message';
    const justify = type === 'sender' ? 'justify-content-end' : 'justify-content-start';
    
    const messageHtml = `
        <div class="row ${justify} mb-4">
            <div class="width-size">
                <div class="${messageClass}">${message}</div>
            </div>
        </div>`;
    
    elements.chatCanvasBody.append(messageHtml);
    // Auto-scroll para a última mensagem
    elements.chatCanvasBody.scrollTop(elements.chatCanvasBody[0].scrollHeight);
}

/**
 * Configura a interface para o estado 'ouvindo'.
 */
export function showListeningUI() {
    elements.ovalSection.hide();
    elements.siriWaveSection.show();
    siriWave.start();
    updateWishMessage('🎤 Escutando... Fale agora!');
    elements.micBtn.html('<i class="bi bi-mic-fill"></i>').css('background', 'rgba(255, 0, 0, 0.3)');
}

/**
 * Restaura a interface para o estado padrão após o reconhecimento de voz.
 */
export function resetMicInterface() {
    siriWave.stop();
    elements.siriWaveSection.hide();
    elements.ovalSection.show();
    elements.micBtn.html('<i class="bi bi-mic"></i>').css('background', '');
}

/**
 * Configura a interface para o estado 'processando'.
 */
export function showProcessingUI() {
    elements.ovalSection.hide();
    elements.siriWaveSection.show();
    siriWave.start();
    updateWishMessage('🤖 Processando sua mensagem...');
}

/**
 * Restaura a tela principal após o processamento, limpando o input.
 * @param {string} [message='Pergunte-me qualquer coisa'] - A mensagem a ser exibida.
 */
export function resetToMainScreen(message = 'Pergunte-me qualquer coisa') {
    siriWave.stop();
    elements.chatbox.val('');
    elements.micBtn.show();
    elements.sendBtn.hide();
    
    setTimeout(() => {
        elements.siriWaveSection.hide();
        elements.ovalSection.show();
        updateWishMessage(message);
    }, 4000); // Delay para o usuário ler a resposta
}

/**
 * Executa a sequência de animação de inicialização (versão sem Eel).
 */
export function startInitialAnimation() {
    elements.chatCanvasBody.empty();

    // Oculta a tela de loading inicial
    setTimeout(() => {
        if (elements.loadingScreen && elements.loadingScreen.length) {
            elements.loadingScreen.addClass('fade-out');
            setTimeout(() => {
                elements.loadingScreen.hide(); // agora some de vez
            }, 500); // espera a animação terminar
        }
    }, 500);
}

    animate(null, 'loader', 'Inicializando J.A.R.V.I.S...', 1000);
    animate('loader', 'faceAuth', 'Autenticando...', 4000);
    animate('faceAuth', 'faceAuthSuccess', 'Verificando identidade...', 7000);
    animate('faceAuthSuccess', 'helloGreet', 'Identidade confirmada.', 10000);

    // Transição final para a tela principal
    setTimeout(() => {
        elements.startSection.addClass('animate__animated animate__fadeOut');
        elements.ovalSection.show().addClass('animate__animated animate__zoomIn');
        updateWishMessage('Olá, como posso ajudar?');
        
        elements.startSection.on('animationend', () => elements.startSection.hide());
    }, 13000);
}

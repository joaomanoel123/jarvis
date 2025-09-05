/**
 * ui.js
 * 
 * Módulo responsável por toda a manipulação do DOM (Document Object Model).
 * Ele abstrai a complexidade da interface, fornecendo funções simples para controlar o que o usuário vê.
 * Nenhum outro módulo deve interagir diretamente com o HTML.
 */

import { initSiriWave } from 'js/siriwave.js';

// ui.js - Controle da interface J.A.R.V.I.S

// Elementos principais da UI
export const elements = {
    chatCanvasBody: $("#chat-canvas-body"),
    loadingScreen: $("#loadingScreen"),
    userInput: $("#user-input"),
    sendButton: $("#send-btn"),
    micButton: $("#mic-btn"),
    outputArea: $("#output-area"),
    siriWave: null,
};

// Inicialização da UI
export function initUI() {
    // Inicializa SiriWave
    elements.siriWave = new SiriWave({
        container: document.getElementById("siri-container"),
        width: 400,
        height: 200,
        style: "ios9",
        autostart: true,
    });

    // Botão enviar mensagem
    elements.sendButton.on("click", () => {
        const msg = elements.userInput.val().trim();
        if (msg) {
            addMessage("Você", msg);
            elements.userInput.val("");
        }
    });

    // Enter no campo input
    elements.userInput.on("keypress", (e) => {
        if (e.which === 13) {
            elements.sendButton.click();
        }
    });

    // Botão microfone (placeholder)
    elements.micButton.on("click", () => {
        addMessage("J.A.R.V.I.S", "🎤 Reconhecimento de voz ainda não implementado.");
    });
}

// Função para adicionar mensagens no chat
export function addMessage(sender, text) {
    const msgHtml = `
        <div class="chat-message">
            <strong>${sender}:</strong> ${text}
        </div>
    `;
    elements.chatCanvasBody.append(msgHtml);
    elements.chatCanvasBody.scrollTop(elements.chatCanvasBody[0].scrollHeight);
}

// Animação inicial e controle do loading
export function startInitialAnimation() {
    elements.chatCanvasBody.empty();

    // Oculta a tela de loading inicial
    setTimeout(() => {
        if (elements.loadingScreen && elements.loadingScreen.length) {
            elements.loadingScreen.addClass("fade-out");
            setTimeout(() => {
                elements.loadingScreen.hide(); // remove de vez
            }, 500); // espera a animação terminar
        }
    }, 500);
}

// Versão atualizada do main-github-pages.js // Alterações realizadas: // 1. /command -> /chat // 2. data.reply -> data.response

erroaquiaq$(document).ready(function () {

const isGitHubPages = window.location.hostname.includes('github.io');
const API_URL = isGitHubPages ? 'https://jarvis-tdgt.onrender.com' : 'http://localhost:8000';

console.log('🤖 Jarvis iniciando...');
console.log('🌐 Modo:', isGitHubPages ? 'GitHub Pages' : 'Local');
console.log('🔗 API URL:', API_URL);

if (!isGitHubPages && typeof eel !== 'undefined') {
    eel.init()()
}

// Inicialização GitHub Pages (mesmo código anterior omitido por brevidade)

const DEFAULT_API_URL = 'https://jarvis-tdgt.onrender.com';

function PlayAssistant(message) {
    if (message != "") {
        console.log('Enviando mensagem:', message);

        const apiUrl = localStorage.getItem('FRONT_API_URL') || DEFAULT_API_URL;
        console.log('Usando API:', apiUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        fetch(apiUrl.replace(new RegExp('/$'), '') + '/chat', {
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
            if (!response.ok) throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            if (data && data.response) {
                $("#WishMessage").text(data.response);
                if (window.jarvisGoogleTTS && window.jarvisGoogleTTS.isEnabled && window.jarvisGoogleTTS.apiKey) {
                    window.jarvisGoogleTTS.speakResponse(data.response);
                } else if (window.jarvisTTS && window.jarvisTTS.isEnabled) {
                    window.jarvisTTS.speakResponse(data.response);
                }
                if (window.eel && window.eel.exposed_functions && window.eel.exposed_functions.receiverText) {
                    window.eel.exposed_functions.receiverText(data.response);
                }
            } else if (data && data.error) {
                let errorMessage = data.response || 'Erro desconhecido';
                $("#WishMessage").text(errorMessage);
            } else {
                $("#WishMessage").text("Resposta inválida da API. Tente novamente.");
            }
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.error('Erro na API:', error);
            if (error.name === 'AbortError') {
                $("#WishMessage").text("Timeout: A API demorou muito para responder.");
            } else if (error.message.includes('Failed to fetch')) {
                $("#WishMessage").text("Erro de conexão: Verifique sua internet.");
            } else {
                $("#WishMessage").text(`Erro: ${error.message}`);
            }
        });
    }
}

// Outras funções permanecem inalteradas...

});


(function () {
    console.log("🔧 J.A.R.V.I.S iniciado...");

    // 🔽 Marca o tempo inicial global
    let startTime = Date.now();

    if (!window.jarvisConfig) {
        console.warn("⚠️ Configurações não carregadas, aplicando padrão.");
        window.jarvisConfig = {
            theme: "dark",
            language: "pt-BR",
            voice: "default",
            wakeWord: "jarvis"
        };
    }

    window.resetJarvisConfig = function () {
        window.jarvisConfig = {
            theme: "dark",
            language: "pt-BR",
            voice: "default",
            wakeWord: "jarvis"
        };
        console.log("🔄 Configurações resetadas:", window.jarvisConfig);
    };

    document.addEventListener("DOMContentLoaded", () => {
        console.log("✅ Config carregada:", window.jarvisConfig);

        const loadingScreen = document.querySelector(".loading-screen");
        const startSection = document.getElementById("Start");
        const input = document.getElementById("chatbox");
        const sendBtn = document.getElementById("SendBtn");

        // 🔽 Controle de animação
        if (loadingScreen && startSection) {
            setTimeout(() => {
                loadingScreen.classList.add("fade-out");
                startSection.classList.add("visible");
                console.log("🚀 Animação concluída em:", Date.now() - startTime, "ms");

                // 🔽 Habilita input e respostas só depois do fade-out
                if (input && sendBtn) {
                    sendBtn.disabled = false;
                    input.disabled = false;
                    sendBtn.addEventListener("click", () => {
                        const msg = input.value.trim();
                        if (msg) {
                            console.log("📩 Usuário disse:", msg, "| tempo:", Date.now() - startTime, "ms");
                            input.value = "";
                            // aqui chamaria a IA Jarvis responder
                            console.log("🤖 J.A.R.V.I.S responde:", "Simulação de resposta para '" + msg + "'");
                        }
                    });
                }
            }, 1500); // tempo da tela de loading
        }
    });
})();
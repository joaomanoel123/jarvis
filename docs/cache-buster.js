/**
 * Cache Buster para JARVIS - Versão Otimizada
 * Limpa cache problemático e força recarregamento de recursos
 */

(function() {
    'use strict';
    
    console.log('🧹 Cache Buster ativo - Limpando cache...');
    
    // Controle de tentativas para evitar loops infinitos
    let reloadAttempts = {
        jquery: 0,
        siriwave: 0,
        textillate: 0
    };
    const MAX_ATTEMPTS = 2;
    
    // Limpar localStorage problemático
    try {
        // Manter apenas configurações importantes
        const importantKeys = ['FRONT_API_URL', 'jarvis_tts_settings', 'jarvis_google_tts_settings'];
        const keysToKeep = {};
        
        importantKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                keysToKeep[key] = value;
            }
        });
        
        // Limpar tudo
        localStorage.clear();
        
        // Restaurar configurações importantes
        Object.keys(keysToKeep).forEach(key => {
            localStorage.setItem(key, keysToKeep[key]);
        });
        
        console.log('✅ localStorage limpo e configurações importantes restauradas');
    } catch (error) {
        console.warn('⚠️ Erro ao limpar localStorage:', error);
    }
    
    // Limpar sessionStorage
    try {
        sessionStorage.clear();
        console.log('✅ sessionStorage limpo');
    } catch (error) {
        console.warn('⚠️ Erro ao limpar sessionStorage:', error);
    }
    
    // Forçar recarregamento de recursos com cache busting
    const version = Date.now();
    
    // Adicionar parâmetro de versão aos recursos críticos
    document.addEventListener('DOMContentLoaded', function() {
        // Cache bust para CSS (apenas se necessário)
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (link.href && !link.href.includes('?v=') && !link.href.includes('cdn.')) {
                const separator = link.href.includes('?') ? '&' : '?';
                link.href += `${separator}v=${version}`;
            }
        });
        
        console.log('🎨 CSS cache busted');

        // Cache bust para JS
        const jsScripts = document.querySelectorAll('script[src]');
        jsScripts.forEach(script => {
            // Evitar adicionar a fontes externas (CDNs, etc.)
            if (script.src && !script.src.includes('?v=') && !script.src.includes('cdn.') && !script.src.includes('lottiefiles') && !script.src.includes('unpkg')) {
                const separator = script.src.includes('?') ? '&' : '?';
                script.src += `${separator}v=${version}`;
            }
        });

        console.log('🚀 JS cache busted');
    });
    
    // Detectar e corrigir problemas comuns (com limite de tentativas)
    window.addEventListener('error', function(event) {
        const error = event.error || event;
        const message = error.message || event.message || 'Erro desconhecido';
        const filename = event.filename || '';
        
        // Log menos verboso para evitar spam no console
        console.error('❌ Erro detectado:', {
            message: message,
            filename: filename.split('/').pop(), // Apenas o nome do arquivo
            lineno: event.lineno
        });
        
        // Tentar recuperação automática para erros conhecidos (com limite)
        if ((message.includes('jQuery') || message.includes('$')) && reloadAttempts.jquery < MAX_ATTEMPTS) {
            console.log('🔄 Tentando recarregar jQuery...');
            reloadAttempts.jquery++;
            loadJQuery();
        }
        
        if (message.includes('SiriWave') && reloadAttempts.siriwave < MAX_ATTEMPTS) {
            console.log('🔄 Tentando recarregar SiriWave...');
            reloadAttempts.siriwave++;
            loadSiriWave();
        }
        
        if ((message.includes('textillate') || message.includes('lettering')) && reloadAttempts.textillate < MAX_ATTEMPTS) {
            console.log('🔄 Tentando recarregar Textillate...');
            reloadAttempts.textillate++;
            loadTextillate();
        }
    });
    
    // Função para carregar jQuery como fallback
    function loadJQuery() {
        if (typeof $ === 'undefined' && reloadAttempts.jquery < MAX_ATTEMPTS) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            script.onload = function() {
                console.log('✅ jQuery carregado via CDN');
                // Recarregar dependências do jQuery
                if (reloadAttempts.textillate < MAX_ATTEMPTS) {
                    setTimeout(loadTextillate, 500);
                }
            };
            script.onerror = function() {
                console.error('❌ Falha ao carregar jQuery via CDN');
            };
            document.head.appendChild(script);
        }
    }
    
    // Função para carregar SiriWave como fallback
    function loadSiriWave() {
        if (typeof SiriWave === 'undefined' && reloadAttempts.siriwave < MAX_ATTEMPTS) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/siriwave/dist/siriwave.umd.min.js';
            script.onload = function() {
                console.log('✅ SiriWave carregado via CDN');
            };
            script.onerror = function() {
                console.error('❌ Falha ao carregar SiriWave via CDN');
            };
            document.head.appendChild(script);
        }
    }
    
    // Função para carregar Textillate como fallback
    function loadTextillate() {
        if (typeof $ !== 'undefined' && typeof $.fn.textillate === 'undefined' && reloadAttempts.textillate < MAX_ATTEMPTS) {
            // Verificar se Lettering.js está disponível primeiro
            if (typeof $.fn.lettering === 'undefined') {
                const letteringScript = document.createElement('script');
                letteringScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lettering.js/0.7.0/jquery.lettering.min.js';
                letteringScript.onload = function() {
                    console.log('✅ Lettering.js carregado via CDN');
                    // Depois carregar Textillate
                    loadTextillateScript();
                };
                letteringScript.onerror = function() {
                    console.error('❌ Falha ao carregar Lettering.js via CDN');
                };
                document.head.appendChild(letteringScript);
            } else {
                loadTextillateScript();
            }
        }
    }
    
    function loadTextillateScript() {
        const textillateScript = document.createElement('script');
        textillateScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/textillate/0.4.0/jquery.textillate.min.js';
        textillateScript.onload = function() {
            console.log('✅ Textillate carregado via CDN');
        };
        textillateScript.onerror = function() {
            console.error('❌ Falha ao carregar Textillate via CDN');
        };
        document.head.appendChild(textillateScript);
    }
    
    // Verificar conectividade e recursos (execução única)
    function checkResources() {
        const checks = [
            { name: 'jQuery', test: () => typeof $ !== 'undefined' },
            { name: 'SiriWave', test: () => typeof SiriWave !== 'undefined' },
            { name: 'Textillate', test: () => typeof $ !== 'undefined' && typeof $.fn.textillate !== 'undefined' },
            { name: 'Lettering', test: () => typeof $ !== 'undefined' && typeof $.fn.lettering !== 'undefined' },
            { name: 'Bootstrap', test: () => document.querySelector('.container-fluid') !== null }
        ];
        
        let allGood = true;
        checks.forEach(check => {
            if (check.test()) {
                console.log(`✅ ${check.name} disponível`);
            } else {
                console.warn(`⚠️ ${check.name} não disponível`);
                allGood = false;
            }
        });
        
        if (allGood) {
            console.log('🎉 Todos os recursos estão funcionando corretamente!');
        }
    }
    
    // Executar verificações após carregamento (apenas uma vez)
    let resourcesChecked = false;
    window.addEventListener('load', function() {
        if (!resourcesChecked) {
            resourcesChecked = true;
            setTimeout(checkResources, 1000);
        }
    });
    
    // Verificação adicional para garantir que as dependências estão carregadas
    function ensureDependencies() {
        // Verificar jQuery
        if (typeof $ === 'undefined') {
            console.warn('⚠️ jQuery não encontrado, carregando...');
            loadJQuery();
        }
        
        // Verificar SiriWave
        if (typeof SiriWave === 'undefined') {
            console.warn('⚠️ SiriWave não encontrado, carregando...');
            loadSiriWave();
        }
        
        // Verificar Textillate (apenas se jQuery estiver disponível)
        if (typeof $ !== 'undefined' && typeof $.fn.textillate === 'undefined') {
            console.warn('⚠️ Textillate não encontrado, carregando...');
            loadTextillate();
        }
    }
    
    // Executar verificação de dependências após um pequeno delay
    setTimeout(ensureDependencies, 2000);
    
    console.log('🚀 Cache Buster inicializado');
})();
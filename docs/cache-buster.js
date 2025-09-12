/**
 * Cache Buster para JARVIS
 * Limpa cache problemático e força recarregamento de recursos
 */

(function() {
    'use strict';
    
    console.log('🧹 Cache Buster ativo - Limpando cache...');
    
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
        // Cache bust para CSS
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (link.href && !link.href.includes('?v=')) {
                const separator = link.href.includes('?') ? '&' : '?';
                link.href += `${separator}v=${version}`;
            }
        });
        
        console.log('🎨 CSS cache busted');
    });
    
    // Detectar e corrigir problemas comuns
    window.addEventListener('error', function(event) {
        const error = event.error || event;
        const message = error.message || event.message || 'Erro desconhecido';
        
        // Log detalhado para debug
        console.error('❌ Erro detectado:', {
            message: message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: error.stack
        });
        
        // Tentar recuperação automática para erros conhecidos
        if (message.includes('jQuery') || message.includes('$')) {
            console.log('🔄 Tentando recarregar jQuery...');
            loadJQuery();
        }
        
        if (message.includes('SiriWave')) {
            console.log('🔄 Tentando recarregar SiriWave...');
            loadSiriWave();
        }
        
        if (message.includes('textillate')) {
            console.log('🔄 Tentando recarregar Textillate...');
            loadTextillate();
        }
    });
    
    // Função para carregar jQuery como fallback
    function loadJQuery() {
        if (typeof $ === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
            script.onload = function() {
                console.log('✅ jQuery carregado via CDN');
            };
            script.onerror = function() {
                console.error('❌ Falha ao carregar jQuery via CDN');
            };
            document.head.appendChild(script);
        }
    }
    
    // Função para carregar SiriWave como fallback
    function loadSiriWave() {
        if (typeof SiriWave === 'undefined') {
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
        if (typeof $.fn.textillate === 'undefined') {
            // Carregar Lettering.js primeiro
            const letteringScript = document.createElement('script');
            letteringScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lettering.js/0.7.0/jquery.lettering.min.js';
            letteringScript.onload = function() {
                // Depois carregar Textillate
                const textillateScript = document.createElement('script');
                textillateScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/textillate/0.4.0/jquery.textillate.min.js';
                textillateScript.onload = function() {
                    console.log('✅ Textillate carregado via CDN');
                };
                document.head.appendChild(textillateScript);
            };
            document.head.appendChild(letteringScript);
        }
    }
    
    // Verificar conectividade e recursos
    function checkResources() {
        const checks = [
            { name: 'jQuery', test: () => typeof $ !== 'undefined' },
            { name: 'SiriWave', test: () => typeof SiriWave !== 'undefined' },
            { name: 'Textillate', test: () => typeof $.fn.textillate !== 'undefined' },
            { name: 'Bootstrap', test: () => document.querySelector('.container-fluid') !== null }
        ];
        
        checks.forEach(check => {
            if (check.test()) {
                console.log(`✅ ${check.name} disponível`);
            } else {
                console.warn(`⚠️ ${check.name} não disponível`);
            }
        });
    }
    
    // Executar verificações após carregamento
    window.addEventListener('load', function() {
        setTimeout(checkResources, 1000);
    });
    
    console.log('🚀 Cache Buster inicializado');
})();
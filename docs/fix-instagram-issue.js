/**
 * Script de diagnóstico e correção do problema do Instagram
 * Execute este script no console do navegador para diagnosticar e corrigir o problema
 */

console.log('🔍 DIAGNÓSTICO DO PROBLEMA DO INSTAGRAM');
console.log('=====================================');

// 1. Verificar se há algum listener automático
console.log('1. Verificando listeners automáticos...');

// Verificar se há algum código que executa automaticamente
const scripts = document.querySelectorAll('script');
let instagramFound = false;

scripts.forEach((script, index) => {
    if (script.src) {
        console.log(`Script ${index + 1}: ${script.src}`);
    } else if (script.textContent && script.textContent.toLowerCase().includes('instagram')) {
        console.log(`⚠️ Script ${index + 1} contém referência ao Instagram:`, script.textContent.substring(0, 200));
        instagramFound = true;
    }
});

// 2. Verificar variáveis globais
console.log('2. Verificando variáveis globais...');
const globalVars = Object.keys(window);
const suspiciousVars = globalVars.filter(key => 
    key.toLowerCase().includes('instagram') || 
    key.toLowerCase().includes('insta')
);

if (suspiciousVars.length > 0) {
    console.log('⚠️ Variáveis suspeitas encontradas:', suspiciousVars);
    suspiciousVars.forEach(varName => {
        console.log(`${varName}:`, window[varName]);
    });
}

// 3. Verificar event listeners
console.log('3. Verificando event listeners...');

// Verificar se há listeners no document
const events = ['click', 'load', 'DOMContentLoaded', 'keypress', 'submit'];
events.forEach(eventType => {
    const listeners = getEventListeners ? getEventListeners(document)[eventType] : null;
    if (listeners && listeners.length > 0) {
        console.log(`Event listeners para ${eventType}:`, listeners.length);
    }
});

// 4. Verificar localStorage e sessionStorage
console.log('4. Verificando storage...');
const localStorageKeys = Object.keys(localStorage);
const sessionStorageKeys = Object.keys(sessionStorage);

const suspiciousStorage = [
    ...localStorageKeys.filter(key => key.toLowerCase().includes('instagram')),
    ...sessionStorageKeys.filter(key => key.toLowerCase().includes('instagram'))
];

if (suspiciousStorage.length > 0) {
    console.log('⚠️ Dados suspeitos no storage:', suspiciousStorage);
}

// 5. Verificar se há algum timer ou interval
console.log('5. Verificando timers...');

// Interceptar window.open para detectar chamadas
const originalWindowOpen = window.open;
let instagramOpenAttempts = 0;

window.open = function(...args) {
    const url = args[0];
    if (url && url.toLowerCase().includes('instagram')) {
        instagramOpenAttempts++;
        console.error(`🚨 TENTATIVA ${instagramOpenAttempts} DE ABRIR INSTAGRAM DETECTADA!`);
        console.error('URL:', url);
        console.error('Stack trace:', new Error().stack);
        
        // Bloquear a abertura
        console.log('✋ Bloqueando abertura do Instagram');
        return null;
    }
    
    return originalWindowOpen.apply(this, args);
};

console.log('✅ Interceptor do window.open instalado');

// 6. Verificar se há algum código que executa em loop
console.log('6. Verificando execução automática...');

// Aguardar um pouco e verificar se houve tentativas
setTimeout(() => {
    if (instagramOpenAttempts > 0) {
        console.error(`🚨 PROBLEMA CONFIRMADO: ${instagramOpenAttempts} tentativas de abrir Instagram detectadas!`);
        
        // Tentar identificar a fonte
        console.log('🔍 Investigando a fonte do problema...');
        
        // Verificar se é do mobile-main.js
        if (window.jarvisMobile || window.jarvisMobileChat) {
            console.log('📱 Detectado sistema mobile ativo');
            
            // Verificar se há comandos ativos
            if (window.jarvisMobile && typeof window.jarvisMobile === 'object') {
                console.log('🔍 Verificando comandos mobile...');
                console.log('jarvisMobile:', window.jarvisMobile);
            }
        }
        
        // Verificar se é do main-github-pages.js
        if (window.PlayAssistant || window.handleLocalCommands) {
            console.log('💻 Detectado sistema PC ativo');
        }
        
    } else {
        console.log('✅ Nenhuma tentativa de abrir Instagram detectada nos primeiros 5 segundos');
    }
    
    // Instruções para o usuário
    console.log('\n📋 INSTRUÇÕES:');
    console.log('1. Se você viu tentativas de abrir Instagram, o problema está ativo');
    console.log('2. Limpe o cache do navegador (Ctrl+Shift+Delete)');
    console.log('3. Recarregue a página com Ctrl+F5');
    console.log('4. Se o problema persistir, execute: location.reload(true)');
    
}, 5000);

// 7. Função de limpeza forçada
window.forceFixInstagram = function() {
    console.log('🧹 EXECUTANDO LIMPEZA FORÇADA...');
    
    // Limpar storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpar caches
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            console.log('✅ Caches limpos');
            
            // Recarregar página
            setTimeout(() => {
                console.log('🔄 Recarregando página...');
                location.reload(true);
            }, 1000);
        });
    } else {
        // Recarregar página diretamente
        setTimeout(() => {
            console.log('🔄 Recarregando página...');
            location.reload(true);
        }, 1000);
    }
};

console.log('\n🛠️ COMANDOS DISPONÍVEIS:');
console.log('- forceFixInstagram() - Limpa tudo e recarrega');
console.log('- clear-cache.js - Execute o script de limpeza de cache');

console.log('\n⏱️ Aguardando 5 segundos para detectar atividade automática...');
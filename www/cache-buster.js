/**
 * 🧹 Cache Buster - Limpeza completa de cache problemático
 * Remove todas as referências ao Bootstrap 5.3.2 e força atualização
 */

(function() {
    'use strict';
    
    console.log('🧹 Cache Buster: Iniciando limpeza completa...');
    
    // 1. Limpar localStorage
    function clearLocalStorage() {
        const keysToRemove = [
            'bootstrap_fix_applied',
            'jarvis_bootstrap_version',
            'bootstrap_cache_version'
        ];
        
        keysToRemove.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`🗑️ localStorage removido: ${key}`);
            }
        });
    }
    
    // 2. Limpar sessionStorage
    function clearSessionStorage() {
        const keysToRemove = [
            'bootstrap_loaded',
            'jarvis_init_state'
        ];
        
        keysToRemove.forEach(key => {
            if (sessionStorage.getItem(key)) {
                sessionStorage.removeItem(key);
                console.log(`🗑️ sessionStorage removido: ${key}`);
            }
        });
    }
    
    // 3. Remover links Bootstrap 5.3.2 se existirem
    function removeOldBootstrapLinks() {
        const selectors = [
            'link[href*="bootstrap@5.3.2"]',
            'link[href*="bootstrap/5.3.2"]',
            'script[src*="bootstrap@5.3.2"]',
            'script[src*="bootstrap/5.3.2"]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
                console.log(`🗑️ Elemento removido: ${selector}`);
            });
        });
    }
    
    // 4. Limpar cache do Service Worker
    async function clearServiceWorkerCache() {
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                
                for (const cacheName of cacheNames) {
                    // Remover caches antigos
                    if (cacheName.includes('bootstrap') || 
                        cacheName.includes('5.3.2') || 
                        cacheName.includes('jarvis-v1.0.') && !cacheName.includes('v1.0.6')) {
                        await caches.delete(cacheName);
                        console.log(`🗑️ Cache removido: ${cacheName}`);
                    }
                    
                    // Limpar entradas específicas do cache atual
                    const cache = await caches.open(cacheName);
                    const requests = await cache.keys();
                    
                    for (const request of requests) {
                        if (request.url.includes('bootstrap@5.3.2') || 
                            request.url.includes('bootstrap/5.3.2')) {
                            await cache.delete(request);
                            console.log(`🗑️ Cache entry removido: ${request.url}`);
                        }
                    }
                }
                
                console.log('✅ Cache do Service Worker limpo');
            } catch (error) {
                console.warn('⚠️ Erro ao limpar cache:', error);
            }
        }
    }
    
    // 5. Forçar reload do Service Worker
    async function updateServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    await registration.update();
                    console.log('🔄 Service Worker atualizado');
                    
                    // Forçar ativação do novo SW
                    if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                }
            } catch (error) {
                console.warn('⚠️ Erro ao atualizar Service Worker:', error);
            }
        }
    }
    
    // 6. Verificar e corrigir preload
    function fixPreloadLinks() {
        const preloadLinks = document.querySelectorAll('link[rel="preload"]');
        
        preloadLinks.forEach(link => {
            if (link.href.includes('bootstrap@5.3.2')) {
                // Corrigir para versão 5.3.8
                const newHref = link.href.replace('bootstrap@5.3.2', 'bootstrap@5.3.8');
                link.href = newHref;
                console.log(`🔧 Preload corrigido: ${newHref}`);
            }
        });
    }
    
    // 7. Adicionar meta tag para forçar no-cache
    function addNoCacheHeaders() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Cache-Control';
        meta.content = 'no-cache, no-store, must-revalidate';
        document.head.appendChild(meta);
        
        const pragma = document.createElement('meta');
        pragma.httpEquiv = 'Pragma';
        pragma.content = 'no-cache';
        document.head.appendChild(pragma);
        
        const expires = document.createElement('meta');
        expires.httpEquiv = 'Expires';
        expires.content = '0';
        document.head.appendChild(expires);
        
        console.log('🚫 Headers no-cache adicionados');
    }
    
    // 8. Função principal
    async function runCacheBuster() {
        console.log('🧹 Executando limpeza completa...');
        
        // Executar todas as limpezas
        clearLocalStorage();
        clearSessionStorage();
        removeOldBootstrapLinks();
        fixPreloadLinks();
        addNoCacheHeaders();
        
        // Limpezas assíncronas
        await clearServiceWorkerCache();
        await updateServiceWorker();
        
        // Marcar que a limpeza foi executada
        localStorage.setItem('cache_buster_executed', new Date().toISOString());
        
        console.log('✅ Cache Buster: Limpeza completa finalizada!');
        console.log('🔄 Recomendado: Faça um hard refresh (Ctrl+Shift+R)');
    }
    
    // 9. Verificar se já foi executado recentemente
    function shouldRunCacheBuster() {
        const lastRun = localStorage.getItem('cache_buster_executed');
        if (!lastRun) return true;
        
        const lastRunDate = new Date(lastRun);
        const now = new Date();
        const hoursSinceLastRun = (now - lastRunDate) / (1000 * 60 * 60);
        
        // Executar se passou mais de 1 hora
        return hoursSinceLastRun > 1;
    }
    
    // 10. Executar automaticamente
    if (shouldRunCacheBuster()) {
        // Executar após um pequeno delay para garantir que o DOM está pronto
        setTimeout(runCacheBuster, 100);
    } else {
        console.log('✅ Cache Buster já executado recentemente');
    }
    
    // 11. Expor função para execução manual
    window.cacheBuster = {
        run: runCacheBuster,
        clearAll: async () => {
            localStorage.removeItem('cache_buster_executed');
            await runCacheBuster();
        }
    };
    
    console.log('🧹 Cache Buster carregado. Use window.cacheBuster.run() para execução manual.');
    
})();
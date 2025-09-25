/**
 * Script para forçar limpeza de cache do navegador
 * Execute este script no console do navegador para limpar caches problemáticos
 */

console.log('🧹 Iniciando limpeza de cache...');

// Limpar localStorage
try {
    localStorage.clear();
    console.log('✅ localStorage limpo');
} catch (e) {
    console.warn('⚠️ Erro ao limpar localStorage:', e);
}

// Limpar sessionStorage
try {
    sessionStorage.clear();
    console.log('✅ sessionStorage limpo');
} catch (e) {
    console.warn('⚠️ Erro ao limpar sessionStorage:', e);
}

// Limpar Service Worker caches
if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
        console.log('🔍 Caches encontrados:', cacheNames);
        
        const promises = cacheNames.map(function(cacheName) {
            console.log('🗑️ Removendo cache:', cacheName);
            return caches.delete(cacheName);
        });
        
        return Promise.all(promises);
    }).then(function() {
        console.log('✅ Todos os caches removidos');
        
        // Recarregar a página após limpeza
        setTimeout(() => {
            console.log('🔄 Recarregando página...');
            window.location.reload(true);
        }, 1000);
    }).catch(function(error) {
        console.error('❌ Erro ao limpar caches:', error);
    });
} else {
    console.log('ℹ️ Cache API não disponível');
    // Recarregar mesmo assim
    setTimeout(() => {
        console.log('🔄 Recarregando página...');
        window.location.reload(true);
    }, 1000);
}

// Unregister service workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        console.log('🔍 Service Workers encontrados:', registrations.length);
        
        const promises = registrations.map(function(registration) {
            console.log('🗑️ Removendo Service Worker:', registration.scope);
            return registration.unregister();
        });
        
        return Promise.all(promises);
    }).then(function() {
        console.log('✅ Todos os Service Workers removidos');
    }).catch(function(error) {
        console.error('❌ Erro ao remover Service Workers:', error);
    });
}

console.log('🎯 Limpeza de cache concluída! A página será recarregada automaticamente.');
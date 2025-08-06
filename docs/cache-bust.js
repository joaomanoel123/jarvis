// Cache Buster para GitHub Pages
// Força a atualização dos arquivos JavaScript

(function() {
    const timestamp = new Date().getTime();
    console.log('🔄 Cache Buster ativo:', timestamp);
    
    // Adicionar timestamp aos scripts para forçar reload
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (script.src.includes('jarvis-web.js') || script.src.includes('main.js')) {
            const newSrc = script.src + '?v=' + timestamp;
            console.log('🔄 Atualizando script:', newSrc);
        }
    });
    
    // Limpar localStorage para garantir configurações limpas
    if (localStorage.getItem('jarvis_cache_cleared') !== timestamp.toString()) {
        console.log('🧹 Limpando cache local...');
        localStorage.clear();
        localStorage.setItem('jarvis_cache_cleared', timestamp.toString());
    }
})();
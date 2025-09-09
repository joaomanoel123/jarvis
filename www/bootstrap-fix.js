/**
 * 🔧 Bootstrap Fix - Correção automática do erro de integrity mismatch
 * Resolve o problema: "bootstrap@5.3.2 is found, but is not used due to an integrity mismatch"
 */

(function() {
    'use strict';
    
    console.log('🔧 Bootstrap Fix: Iniciando verificação...');
    
    // Configuração
    const CORRECT_BOOTSTRAP_VERSION = '5.0.2';
    const CORRECT_BOOTSTRAP_URL = `https://cdn.jsdelivr.net/npm/bootstrap@${CORRECT_BOOTSTRAP_VERSION}/dist/css/bootstrap.min.css`;
    const CORRECT_INTEGRITY = 'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC';
    
    // Função para detectar problemas do Bootstrap
    function detectBootstrapIssues() {
        const issues = [];
        
        // Verificar todos os links CSS
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        
        cssLinks.forEach((link, index) => {
            const href = link.href;
            
            // Verificar se é um link do Bootstrap
            if (href.includes('bootstrap') && href.includes('cdn.jsdelivr.net')) {
                console.log(`🔍 Bootstrap link encontrado [${index}]:`, href);
                
                // Verificar versão
                const versionMatch = href.match(/bootstrap@(\d+\.\d+\.\d+)/);
                if (versionMatch) {
                    const version = versionMatch[1];
                    console.log(`📦 Versão detectada: ${version}`);
                    
                    if (version !== CORRECT_BOOTSTRAP_VERSION) {
                        issues.push({
                            type: 'wrong_version',
                            element: link,
                            currentVersion: version,
                            correctVersion: CORRECT_BOOTSTRAP_VERSION,
                            currentUrl: href
                        });
                    }
                }
                
                // Verificar integrity
                const integrity = link.integrity;
                if (integrity && integrity !== CORRECT_INTEGRITY) {
                    issues.push({
                        type: 'wrong_integrity',
                        element: link,
                        currentIntegrity: integrity,
                        correctIntegrity: CORRECT_INTEGRITY
                    });
                }
                
                // Verificar se o link está carregando corretamente
                if (link.sheet) {
                    try {
                        // Tentar acessar as regras CSS para verificar se carregou
                        const rules = link.sheet.cssRules || link.sheet.rules;
                        console.log(`✅ Bootstrap CSS carregado com ${rules.length} regras`);
                    } catch (e) {
                        console.warn('⚠️ Erro ao acessar regras CSS:', e.message);
                        issues.push({
                            type: 'css_access_error',
                            element: link,
                            error: e.message
                        });
                    }
                } else {
                    console.warn('⚠️ Bootstrap CSS não carregou ou ainda está carregando');
                }
            }
        });
        
        return issues;
    }
    
    // Função para corrigir problemas automaticamente
    function fixBootstrapIssues(issues) {
        console.log(`🔧 Corrigindo ${issues.length} problema(s) do Bootstrap...`);
        
        issues.forEach((issue, index) => {
            console.log(`🔧 Corrigindo problema ${index + 1}:`, issue.type);
            
            switch (issue.type) {
                case 'wrong_version':
                case 'wrong_integrity':
                    // Remover link problemático
                    issue.element.remove();
                    console.log('🗑️ Link problemático removido');
                    
                    // Criar novo link correto
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = CORRECT_BOOTSTRAP_URL;
                    newLink.integrity = CORRECT_INTEGRITY;
                    newLink.crossOrigin = 'anonymous';
                    
                    // Adicionar ao head
                    document.head.appendChild(newLink);
                    console.log('✅ Novo link Bootstrap adicionado');
                    
                    // Verificar se carregou
                    newLink.onload = () => {
                        console.log('✅ Bootstrap corrigido carregado com sucesso');
                        
                        // Salvar no localStorage que a correção foi aplicada
                        localStorage.setItem('bootstrap_fix_applied', new Date().toISOString());
                    };
                    
                    newLink.onerror = () => {
                        console.error('❌ Erro ao carregar Bootstrap corrigido');
                    };
                    break;
                    
                case 'css_access_error':
                    console.warn('⚠️ Problema de acesso CSS detectado, mas não corrigível automaticamente');
                    break;
            }
        });
    }
    
    // Função para limpar cache relacionado ao Bootstrap
    async function clearBootstrapCache() {
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                
                for (const cacheName of cacheNames) {
                    const cache = await caches.open(cacheName);
                    const requests = await cache.keys();
                    
                    for (const request of requests) {
                        if (request.url.includes('bootstrap')) {
                            await cache.delete(request);
                            console.log('🗑️ Cache Bootstrap removido:', request.url);
                        }
                    }
                }
                
                console.log('✅ Cache Bootstrap limpo');
            } catch (error) {
                console.warn('⚠️ Erro ao limpar cache Bootstrap:', error);
            }
        }
    }
    
    // Função para verificar se a correção já foi aplicada
    function wasFixApplied() {
        const lastFix = localStorage.getItem('bootstrap_fix_applied');
        if (lastFix) {
            const fixDate = new Date(lastFix);
            const now = new Date();
            const hoursSinceFix = (now - fixDate) / (1000 * 60 * 60);
            
            // Considerar válido por 24 horas
            return hoursSinceFix < 24;
        }
        return false;
    }
    
    // Função principal
    function runBootstrapFix() {
        console.log('🔧 Bootstrap Fix: Executando verificação completa...');
        
        // Verificar se já foi corrigido recentemente
        if (wasFixApplied()) {
            console.log('✅ Bootstrap Fix já foi aplicado recentemente');
            return;
        }
        
        // Detectar problemas
        const issues = detectBootstrapIssues();
        
        if (issues.length === 0) {
            console.log('✅ Nenhum problema do Bootstrap detectado');
            return;
        }
        
        console.warn(`⚠️ ${issues.length} problema(s) do Bootstrap detectado(s):`, issues);
        
        // Limpar cache primeiro
        clearBootstrapCache().then(() => {
            // Corrigir problemas
            fixBootstrapIssues(issues);
        });
    }
    
    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runBootstrapFix);
    } else {
        // DOM já está pronto
        runBootstrapFix();
    }
    
    // Também executar quando a página carregar completamente
    window.addEventListener('load', () => {
        // Aguardar um pouco para garantir que todos os recursos carregaram
        setTimeout(() => {
            const issues = detectBootstrapIssues();
            if (issues.length > 0) {
                console.warn('⚠️ Problemas do Bootstrap ainda detectados após carregamento completo');
                fixBootstrapIssues(issues);
            }
        }, 1000);
    });
    
    // Expor funções para debug
    window.bootstrapFix = {
        detect: detectBootstrapIssues,
        fix: fixBootstrapIssues,
        clearCache: clearBootstrapCache,
        run: runBootstrapFix
    };
    
    console.log('🔧 Bootstrap Fix: Sistema carregado. Use window.bootstrapFix para debug.');
    
})();
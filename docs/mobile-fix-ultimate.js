/*
 * MOBILE FIX ULTIMATE - JAVASCRIPT AGRESSIVO PARA ESCONDER TEXTO NO MOBILE
 * Este script deve ser carregado e executado múltiplas vezes
 */

(function() {
    'use strict';
    
    console.log('🔧 Mobile Fix Ultimate carregado');
    
    // Função para esconder o elemento de forma agressiva
    function hideAskTextAggressive() {
        const isMobile = window.innerWidth < 768;
        
        if (!isMobile) {
            console.log('🖥️ Desktop detectado - não aplicando fix mobile');
            return false;
        }
        
        console.log('📱 Mobile detectado - aplicando fix agressivo');
        
        // Múltiplos seletores para garantir que encontremos o elemento
        const selectors = [
            'h5.text-light.text-center',
            '.text-light.text-center',
            'h5[class*="text-light"][class*="text-center"]',
            'h5:contains("Pergunte-me qualquer coisa")',
            '*:contains("Pergunte-me qualquer coisa")'
        ];
        
        let elementsHidden = 0;
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element && element.textContent && element.textContent.includes('Pergunte-me qualquer coisa')) {
                        // Aplicar múltiplas técnicas de ocultação
                        element.style.display = 'none';
                        element.style.visibility = 'hidden';
                        element.style.opacity = '0';
                        element.style.height = '0';
                        element.style.margin = '0';
                        element.style.padding = '0';
                        element.style.overflow = 'hidden';
                        element.style.position = 'absolute';
                        element.style.left = '-9999px';
                        element.style.top = '-9999px';
                        element.style.zIndex = '-1';
                        
                        // Adicionar classes de ocultação
                        element.classList.add('mobile-hide', 'hide-mobile', 'd-none');
                        
                        // Remover do DOM como último recurso
                        element.setAttribute('hidden', 'true');
                        element.setAttribute('aria-hidden', 'true');
                        
                        elementsHidden++;
                        console.log(`✅ Elemento escondido: ${selector}`);
                    }
                });
            } catch (e) {
                console.warn(`⚠️ Erro com seletor ${selector}:`, e.message);
            }
        });
        
        // Busca por texto específico
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.textContent && element.textContent.trim() === 'Pergunte-me qualquer coisa') {
                element.style.display = 'none';
                element.classList.add('mobile-hide');
                elementsHidden++;
                console.log('✅ Elemento escondido por texto específico');
            }
        });
        
        console.log(`📊 Total de elementos escondidos: ${elementsHidden}`);
        return elementsHidden > 0;
    }
    
    // Função para aplicar CSS dinâmico
    function applyCSSFix() {
        const style = document.createElement('style');
        style.id = 'mobile-fix-ultimate-css';
        style.innerHTML = `
            @media screen and (max-width: 768px) {
                h5.text-light.text-center,
                .text-light.text-center {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    height: 0 !important;
                    position: absolute !important;
                    left: -9999px !important;
                }
            }
        `;
        
        // Remover estilo anterior se existir
        const existingStyle = document.getElementById('mobile-fix-ultimate-css');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('🎨 CSS dinâmico aplicado');
    }
    
    // Função principal
    function executeMobileFix() {
        console.log('🚀 Executando Mobile Fix Ultimate...');
        
        // 1. Aplicar CSS dinâmico
        applyCSSFix();
        
        // 2. Esconder elementos via JavaScript
        const hidden = hideAskTextAggressive();
        
        // 3. Log do resultado
        if (hidden) {
            console.log('✅ Mobile Fix aplicado com sucesso');
        } else {
            console.log('ℹ️ Nenhum elemento encontrado para esconder');
        }
        
        return hidden;
    }
    
    // Executar imediatamente
    executeMobileFix();
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeMobileFix);
    }
    
    // Executar quando página estiver totalmente carregada
    if (document.readyState !== 'complete') {
        window.addEventListener('load', executeMobileFix);
    }
    
    // Executar quando jQuery estiver pronto (se disponível)
    if (typeof $ !== 'undefined') {
        $(document).ready(executeMobileFix);
    }
    
    // Executar periodicamente para garantir
    const intervals = [500, 1000, 2000, 3000, 5000];
    intervals.forEach(delay => {
        setTimeout(executeMobileFix, delay);
    });
    
    // Executar quando a janela for redimensionada
    window.addEventListener('resize', function() {
        setTimeout(executeMobileFix, 100);
    });
    
    // Observar mudanças no DOM
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });
            
            if (shouldCheck) {
                setTimeout(executeMobileFix, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observer de DOM ativado');
    }
    
    // Expor função globalmente para debug
    window.mobileFix = {
        execute: executeMobileFix,
        hide: hideAskTextAggressive,
        css: applyCSSFix
    };
    
    console.log('🎯 Mobile Fix Ultimate inicializado');
})();
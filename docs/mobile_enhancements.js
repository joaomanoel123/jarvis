/**
 * JARVIS MOBILE ENHANCEMENTS
 * Funcionalidades específicas para dispositivos móveis
 * Mantendo compatibilidade com todas as funcionalidades existentes
 */

(function() {
    'use strict';

    // Detecção de dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\b(?:Tablet|Tab)\b)/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Configurações mobile
    const mobileConfig = {
        reducedAnimations: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isLandscape: window.innerHeight < window.innerWidth,
        screenSize: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };

    /**
     * Inicialização das melhorias mobile
     */
    function initMobileEnhancements() {
        if (isMobile || isTouchDevice) {
            console.log('🤖 J.A.R.V.I.S: Inicializando otimizações mobile...');
            
            // Aplicar classes CSS específicas
            document.body.classList.add('mobile-device');
            if (isTablet) document.body.classList.add('tablet-device');
            
            // Configurar viewport
            setupViewport();
            
            // Otimizar animações
            optimizeAnimations();
            
            // Melhorar interações touch
            enhanceTouchInteractions();
            
            // Configurar teclado virtual
            handleVirtualKeyboard();
            
            // Otimizar performance
            optimizePerformance();
            
            // Configurar gestos
            setupGestures();
            
            console.log('✅ J.A.R.V.I.S: Otimizações mobile ativadas');
        }
    }

    /**
     * Configurar viewport para mobile
     */
    function setupViewport() {
        // Prevenir zoom em inputs
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
        }

        // Adicionar meta tags para PWA
        if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
            const mobileCapable = document.createElement('meta');
            mobileCapable.name = 'mobile-web-app-capable';
            mobileCapable.content = 'yes';
            document.head.appendChild(mobileCapable);
        }
    }

    /**
     * Otimizar animações para mobile
     */
    function optimizeAnimations() {
        if (mobileConfig.reducedAnimations || isMobile) {
            // Reduzir animações complexas
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .svg-frame svg {
                        animation-duration: 8s !important;
                    }
                    
                    .square span {
                        animation-duration: 8s !important;
                    }
                    
                    #big-centro, #center-lines {
                        animation-duration: 10s !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Melhorar interações touch
     */
    function enhanceTouchInteractions() {
        // Adicionar feedback visual para botões
        const buttons = document.querySelectorAll('.glow-on-hover, button, .btn');
        
        buttons.forEach(button => {
            // Touch start
            button.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.95)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            // Touch end
            button.addEventListener('touchend', function(e) {
                this.style.transform = 'scale(1)';
                setTimeout(() => {
                    this.style.transition = '';
                }, 100);
            }, { passive: true });
            
            // Touch cancel
            button.addEventListener('touchcancel', function(e) {
                this.style.transform = 'scale(1)';
                this.style.transition = '';
            }, { passive: true });
        });

        // Melhorar área de toque
        const micBtn = document.getElementById('MicBtn');
        if (micBtn && isMobile) {
            micBtn.style.minWidth = '48px';
            micBtn.style.minHeight = '48px';
        }
    }

    /**
     * Lidar com teclado virtual
     */
    function handleVirtualKeyboard() {
        const chatbox = document.getElementById('chatbox');
        if (!chatbox) return;

        // Ajustar layout quando teclado aparece
        chatbox.addEventListener('focus', function() {
            if (isMobile) {
                // Scroll para o input
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
                
                // Reduzir altura do loader se necessário
                const loader = document.getElementById('Loader');
                if (loader) {
                    loader.style.transform = 'scale(0.8)';
                    loader.style.transition = 'transform 0.3s ease';
                }
            }
        });

        chatbox.addEventListener('blur', function() {
            if (isMobile) {
                // Restaurar layout
                const loader = document.getElementById('Loader');
                if (loader) {
                    loader.style.transform = '';
                }
            }
        });

        // Prevenir zoom no iOS
        chatbox.addEventListener('touchstart', function() {
            if (this.style.fontSize !== '16px') {
                this.style.fontSize = '16px';
            }
        });
    }

    /**
     * Otimizar performance para mobile
     */
    function optimizePerformance() {
        // Lazy loading para elementos pesados
        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('svg, canvas');
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        lazyObserver.unobserve(entry.target);
                    }
                });
            });

            lazyElements.forEach(el => lazyObserver.observe(el));
        }

        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleOrientationChange();
            }, 250);
        });

        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Otimizações de scroll se necessário
            }, 100);
        }, { passive: true });
    }

    /**
     * Configurar gestos touch
     */
    function setupGestures() {
        let startY = 0;
        let startX = 0;

        // Swipe para abrir/fechar chat
        document.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!e.changedTouches[0]) return;
            
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const diffY = startY - endY;
            const diffX = startX - endX;

            // Swipe horizontal para chat
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const chatCanvas = document.getElementById('offcanvasScrolling');
                if (chatCanvas) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(chatCanvas);
                    
                    if (diffX > 0 && startX < 50) {
                        // Swipe right from left edge - open chat
                        if (!bsOffcanvas || !bsOffcanvas._isShown) {
                            new bootstrap.Offcanvas(chatCanvas).show();
                        }
                    } else if (diffX < 0 && bsOffcanvas && bsOffcanvas._isShown) {
                        // Swipe left - close chat
                        bsOffcanvas.hide();
                    }
                }
            }
        }, { passive: true });
    }

    /**
     * Lidar com mudança de orientação
     */
    function handleOrientationChange() {
        const isNowLandscape = window.innerHeight < window.innerWidth;
        
        if (isNowLandscape !== mobileConfig.isLandscape) {
            mobileConfig.isLandscape = isNowLandscape;
            
            // Ajustar layout para nova orientação
            if (isMobile) {
                const loader = document.getElementById('Loader');
                if (loader) {
                    if (isNowLandscape) {
                        loader.style.transform = 'scale(0.7)';
                    } else {
                        loader.style.transform = '';
                    }
                }
            }
        }
    }

    /**
     * Melhorar acessibilidade mobile
     */
    function enhanceAccessibility() {
        // Adicionar labels para screen readers
        const micBtn = document.getElementById('MicBtn');
        if (micBtn && !micBtn.getAttribute('aria-label')) {
            micBtn.setAttribute('aria-label', 'Ativar reconhecimento de voz');
        }

        const chatBtn = document.getElementById('ChatBtn');
        if (chatBtn && !chatBtn.getAttribute('aria-label')) {
            chatBtn.setAttribute('aria-label', 'Abrir histórico de conversas');
        }

        // Melhorar navegação por teclado
        const focusableElements = document.querySelectorAll(
            'button, input, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach((el, index) => {
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', index + 1);
            }
        });
    }

    /**
     * Configurar notificações mobile
     */
    function setupMobileNotifications() {
        // Verificar suporte a notificações
        if ('Notification' in window && 'serviceWorker' in navigator) {
            // Configurar notificações se o usuário permitir
            if (Notification.permission === 'default') {
                // Não solicitar automaticamente, deixar para o usuário decidir
                console.log('🔔 J.A.R.V.I.S: Notificações disponíveis');
            }
        }
    }

    /**
     * Adicionar suporte a PWA
     */
    function setupPWASupport() {
        // Detectar se é PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.body.classList.add('pwa-mode');
            console.log('📱 J.A.R.V.I.S: Executando como PWA');
        }

        // Lidar com prompt de instalação
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Mostrar botão de instalação se desejar
            console.log('📲 J.A.R.V.I.S: PWA pode ser instalado');
        });
    }

    /**
     * Monitorar performance mobile
     */
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd > 3000) {
                        console.warn('⚠️ J.A.R.V.I.S: Carregamento lento detectado em mobile');
                    }
                }, 1000);
            });
        }
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileEnhancements);
    } else {
        initMobileEnhancements();
    }

    // Inicializar outras funcionalidades
    enhanceAccessibility();
    setupMobileNotifications();
    setupPWASupport();
    monitorPerformance();

    // Exportar funções para uso global se necessário
    window.JarvisMobile = {
        isMobile,
        isTablet,
        isTouchDevice,
        config: mobileConfig,
        handleOrientationChange
    };

})();
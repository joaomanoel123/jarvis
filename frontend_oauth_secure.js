/**
 * 🔒 Frontend OAuth Seguro para J.A.R.V.I.S
 * Integração com backend OAuth no Render
 */

class SecureGoogleAuthManager {
    constructor() {
        this.baseUrl = this.getBackendUrl();
        this.isSignedIn = false;
        this.currentUser = null;
        this.checkingAuth = false;
        
        console.log('🔒 Inicializando OAuth Seguro...');
        console.log('🌐 Backend URL:', this.baseUrl);
        
        this.init();
    }
    
    getBackendUrl() {
        const hostname = window.location.hostname;
        
        // Detectar ambiente e retornar URL do backend apropriada
        if (hostname.includes('github.io')) {
            // GitHub Pages → Backend no Render
            return 'https://seu-jarvis-backend.onrender.com'; // ⚠️ ALTERE PARA SUA URL DO RENDER
        } else if (hostname.includes('onrender.com')) {
            // Render → Mesmo domínio
            return window.location.origin;
        } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            // Desenvolvimento local
            return 'http://localhost:5000';
        } else {
            // Fallback
            return 'https://seu-jarvis-backend.onrender.com'; // ⚠️ ALTERE PARA SUA URL DO RENDER
        }
    }
    
    async init() {
        try {
            // Verificar se há parâmetros de autenticação na URL
            this.handleAuthCallback();
            
            // Verificar status de autenticação
            await this.checkAuthStatus();
            
            // Adicionar botões à interface
            this.addAuthButtons();
            
            console.log('✅ OAuth Seguro inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar OAuth:', error);
        }
    }
    
    handleAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const authStatus = urlParams.get('auth');
        const message = urlParams.get('message');
        
        if (authStatus === 'success') {
            console.log('🎉 Login realizado com sucesso!');
            this.showNotification('Login realizado com sucesso!', 'success');
            
            // Limpar parâmetros da URL
            this.clearUrlParams();
            
            // Verificar dados do usuário
            setTimeout(() => this.checkAuthStatus(), 1000);
            
        } else if (authStatus === 'error') {
            console.error('❌ Erro na autenticação:', message);
            this.showNotification(`Erro na autenticação: ${message}`, 'error');
            
            // Limpar parâmetros da URL
            this.clearUrlParams();
        }
    }
    
    clearUrlParams() {
        // Remove parâmetros de autenticação da URL sem recarregar a página
        const url = new URL(window.location);
        url.searchParams.delete('auth');
        url.searchParams.delete('message');
        window.history.replaceState({}, document.title, url.toString());
    }
    
    async checkAuthStatus() {
        if (this.checkingAuth) return;
        
        this.checkingAuth = true;
        
        try {
            console.log('🔍 Verificando status de autenticação...');
            
            const response = await fetch(`${this.baseUrl}/auth/user`, {
                method: 'GET',
                credentials: 'include', // Importante para cookies de sessão
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.authenticated && data.user) {
                    this.currentUser = data.user;
                    this.isSignedIn = true;
                    this.onSignIn(data.user);
                    console.log('✅ Usuário autenticado:', data.user.name);
                } else {
                    this.isSignedIn = false;
                    this.currentUser = null;
                    this.onSignOut();
                }
            } else {
                this.isSignedIn = false;
                this.currentUser = null;
                this.onSignOut();
            }
            
        } catch (error) {
            console.error('❌ Erro ao verificar autenticação:', error);
            this.isSignedIn = false;
            this.currentUser = null;
            this.onSignOut();
        } finally {
            this.checkingAuth = false;
        }
    }
    
    async signIn() {
        console.log('🔑 Iniciando login seguro...');
        
        try {
            // Redirecionar para o backend OAuth
            window.location.href = `${this.baseUrl}/auth/google`;
            
        } catch (error) {
            console.error('❌ Erro no login:', error);
            this.showNotification('Erro ao iniciar login', 'error');
        }
    }
    
    async signOut() {
        console.log('🚪 Fazendo logout...');
        
        try {
            const response = await fetch(`${this.baseUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                this.currentUser = null;
                this.isSignedIn = false;
                this.onSignOut();
                this.showNotification('Logout realizado com sucesso!', 'success');
                console.log('✅ Logout realizado com sucesso');
            } else {
                throw new Error('Erro no logout');
            }
            
        } catch (error) {
            console.error('❌ Erro no logout:', error);
            this.showNotification('Erro ao fazer logout', 'error');
        }
    }
    
    onSignIn(user) {
        console.log('👤 Usuário logado:', user);
        
        // Atualizar interface
        this.updateUserInterface(user);
        
        // Disparar evento personalizado
        this.dispatchAuthEvent('google-signin', { user });
        
        // Integrar com sistema de voz se disponível
        if (window.jarvisTTS && window.jarvisTTS.speak) {
            const firstName = user.name.split(' ')[0];
            window.jarvisTTS.speak(`Olá ${firstName}! Bem-vindo de volta ao J.A.R.V.I.S.`);
        }
    }
    
    onSignOut() {
        console.log('👋 Usuário deslogado');
        
        // Atualizar interface
        this.updateUserInterface(null);
        
        // Disparar evento personalizado
        this.dispatchAuthEvent('google-signout', null);
        
        // Integrar com sistema de voz se disponível
        if (window.jarvisTTS && window.jarvisTTS.speak) {
            window.jarvisTTS.speak('Logout realizado com sucesso. Até logo!');
        }
    }
    
    updateUserInterface(user) {
        // Atualizar saudação principal
        const wishMessage = document.getElementById('WishMessage');
        if (wishMessage) {
            if (user) {
                const firstName = user.name.split(' ')[0];
                wishMessage.textContent = `Olá, ${firstName}! Como posso ajudá-lo?`;
            } else {
                wishMessage.textContent = 'Ask me anything';
            }
        }
        
        // Atualizar informações do usuário (se existirem elementos)
        const userInfo = document.getElementById('userInfo');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        
        if (user) {
            if (userInfo) userInfo.style.display = 'block';
            if (userAvatar) userAvatar.src = user.picture || '';
            if (userName) userName.textContent = user.name;
        } else {
            if (userInfo) userInfo.style.display = 'none';
            if (userAvatar) userAvatar.src = '';
            if (userName) userName.textContent = '';
        }
        
        // Atualizar botões
        this.updateAuthButtons();
    }
    
    addAuthButtons() {
        // Adicionar botão de login/logout
        const settingsArea = document.getElementById('TextInput');
        if (settingsArea && !document.getElementById('GoogleAuthBtn')) {
            const authBtn = document.createElement('button');
            authBtn.id = 'GoogleAuthBtn';
            authBtn.className = 'glow-on-hover';
            authBtn.innerHTML = '<i class="bi bi-person-circle"></i>';
            authBtn.title = 'Google Login';
            authBtn.onclick = () => this.toggleAuth();
            
            settingsArea.appendChild(authBtn);
            this.updateAuthButtons();
        }
    }
    
    updateAuthButtons() {
        const authBtn = document.getElementById('GoogleAuthBtn');
        if (authBtn) {
            const icon = authBtn.querySelector('i');
            
            if (this.isSignedIn) {
                icon.className = 'bi bi-person-check-fill';
                authBtn.style.color = '#00ff88';
                authBtn.title = `Logado como ${this.currentUser?.name || 'usuário'} - Clique para logout`;
            } else {
                icon.className = 'bi bi-person-circle';
                authBtn.style.color = '';
                authBtn.title = 'Fazer login com Google';
            }
        }
    }
    
    async toggleAuth() {
        if (this.isSignedIn) {
            await this.signOut();
        } else {
            await this.signIn();
        }
    }
    
    showNotification(message, type = 'info') {
        // Criar notificação visual (opcional)
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Você pode implementar uma notificação visual aqui
        // Por exemplo, usando toast, alert, ou elemento customizado
    }
    
    dispatchAuthEvent(eventName, data) {
        const event = new CustomEvent(eventName, {
            detail: data
        });
        window.dispatchEvent(event);
    }
    
    // Métodos públicos para uso externo
    getCurrentUser() {
        return this.currentUser;
    }
    
    isUserSignedIn() {
        return this.isSignedIn;
    }
    
    getUserProfile() {
        return this.currentUser;
    }
    
    async refreshAuthStatus() {
        await this.checkAuthStatus();
    }
}

// Inicializar quando o documento estiver pronto
let secureGoogleAuthManager = null;

$(document).ready(function() {
    // Aguardar um pouco para garantir que tudo foi carregado
    setTimeout(() => {
        secureGoogleAuthManager = new SecureGoogleAuthManager();
        
        // Tornar disponível globalmente
        window.googleAuthManager = secureGoogleAuthManager;
        window.secureGoogleAuthManager = secureGoogleAuthManager;
        
        console.log('🔒 Secure Google Auth Manager integrado com sucesso!');
    }, 1000);
});

// Event listeners para integração com o J.A.R.V.I.S
window.addEventListener('google-signin', function(event) {
    const userData = event.detail;
    console.log('🎉 Usuário logado via Google (seguro):', userData.user.name);
});

window.addEventListener('google-signout', function(event) {
    console.log('👋 Usuário deslogado (seguro)');
});

// Exportar para uso em outros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureGoogleAuthManager;
}
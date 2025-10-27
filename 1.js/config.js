/**
 * Configuração da API do YaraVac
 * 
 * INSTRUÇÕES PARA DEPLOY:
 * 1. Após fazer deploy do backend no Render, você receberá uma URL tipo:
 *    https://yaravac-backend.onrender.com
 * 
 * 2. Substitua 'SEU_BACKEND_URL_AQUI' por essa URL
 * 
 * 3. A URL final ficará tipo:
 *    https://yaravac-backend.onrender.com/api/v1
 */

const API_CONFIG = {
    // PRODUÇÃO: Cole aqui a URL do seu backend no Render
    PRODUCTION_URL: 'https://SEU_BACKEND_URL_AQUI/api/v1',
    
    // DESENVOLVIMENTO: localhost
    DEVELOPMENT_URL: 'http://localhost:8080/api/v1',
    
    // Detecta automaticamente o ambiente
    get BASE_URL() {
        // Se está rodando no GitHub Pages ou domínio de produção
        if (window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1') {
            return this.PRODUCTION_URL;
        }
        // Desenvolvimento local
        return this.DEVELOPMENT_URL;
    }
};

// Exportar para uso global
window.API_CONFIG = API_CONFIG;

// Log para debug (remover em produção se preferir)
console.log('🚀 API configurada:', API_CONFIG.BASE_URL);
/**
 * main.js
 * 
 * Ponto de entrada principal da aplicação JARVIS.
 * A única responsabilidade deste arquivo é importar o módulo `core` e iniciar a aplicação
 * quando o DOM estiver pronto.
 */

import { init } from './js/core.js';

// Garante que o DOM está completamente carregado antes de iniciar a aplicação.
$(document).ready(() => {
    init();
});

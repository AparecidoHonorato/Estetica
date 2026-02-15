// cypress/support/e2e.js
// Aqui você pode adicionar commands customizados e configurações globais

// Exemplo de comando customizado
Cypress.Commands.add('fillAgendamentoForm', (data) => {
  cy.get('input[name="nome"]').type(data.nome);
  cy.get('input[name="email"]').type(data.email);
  cy.get('input[name="whatsapp"]').type(data.whatsapp);
  cy.get('select[name="servico"]').select(data.servico);
  cy.get('input[name="data"]').type(data.data);
  if (data.mensagem) {
    cy.get('textarea[name="mensagem"]').type(data.mensagem);
  }
});

// Suprimir erros de CORS e outras mensagens não críticas
const app =  window.top;

try {
  if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');

    app.document.head.appendChild(style);
  }
} catch (e) {
  // Ignorar erros
}

// Desabilitar captura de exception não gerenciadas (opcional)
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar certos tipos de erro
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Network') ||
    err.message.includes('Cannot read')
  ) {
    return false;
  }
});

describe('Testes E2E - Modal de Agendamento', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Modal - Abertura e Fechamento', () => {
    it('Deve abrir modal ao clicar em "Agendar"', () => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');
      cy.get('.modal-content').should('be.visible');
      cy.get('.modal-content h3').should('contain', 'Agendar');
    });

    it('Deve fechar modal ao clicar em Cancelar', () => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');

      cy.get('.btn-cancel').click();
      cy.get('.modal-overlay.active').should('not.exist');
    });

    it('Deve fechar ao clicar fora do modal', () => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');

      cy.get('.modal-overlay').click({ force: true });
      cy.get('.modal-overlay.active').should('not.exist');
    });
  });

  describe('Validação - Nome', () => {
    beforeEach(() => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');
    });

    it('Deve rejeitar nome vazio', () => {
      cy.get('input[name="nome"]').clear();
      cy.get('input[name="email"]').type('teste@email.com');
      cy.get('input[name="whatsapp"]').type('11987654321');
      cy.get('input[name="data"]').type('2026-03-20T14:30');

      cy.get('button[type="submit"]').click();
      cy.get('.field-error').should('contain', 'Nome é obrigatório');
    });

    it('Deve rejeitar nome com números', () => {
      cy.get('input[name="nome"]').type('Maria Silva 123');
      cy.get('input[name="email"]').type('teste@email.com');
      cy.get('input[name="whatsapp"]').type('11987654321');
      cy.get('input[name="data"]').type('2026-03-20T14:30');

      cy.get('button[type="submit"]').click();
      cy.get('.field-error').should('exist');
    });

    it('Deve aceitar nome válido', () => {
      cy.get('input[name="nome"]').type('Maria Silva');
      cy.get('input[name="nome"]').should('have.value', 'Maria Silva');
    });
  });

  describe('Validação - Email', () => {
    beforeEach(() => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');
    });

    it('Deve rejeitar email inválido', () => {
      cy.get('input[name="nome"]').type('Maria Silva');
      cy.get('input[name="email"]').type('email-invalido');
      cy.get('input[name="whatsapp"]').type('11987654321');
      cy.get('input[name="data"]').type('2026-03-20T14:30');

      cy.get('button[type="submit"]').click();
      cy.get('.field-error').should('contain', 'Email inválido');
    });

    it('Deve aceitar email válido', () => {
      cy.get('input[name="email"]').type('maria@email.com');
      cy.get('input[name="email"]').should('have.value', 'maria@email.com');
    });
  });

  describe('Validação - WhatsApp', () => {
    beforeEach(() => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');
    });

    it('Deve rejeitar whatsapp inválido', () => {
      cy.get('input[name="nome"]').type('Maria Silva');
      cy.get('input[name="email"]').type('maria@email.com');
      cy.get('input[name="whatsapp"]').type('123');
      cy.get('input[name="data"]').type('2026-03-20T14:30');

      cy.get('button[type="submit"]').click();
      cy.get('.field-error').should('contain', 'WhatsApp inválido');
    });

    it('Deve aceitar whatsapp válido', () => {
      cy.get('input[name="whatsapp"]').type('11987654321');
      cy.get('input[name="whatsapp"]').should('have.value', '11987654321');
    });

    it('Deve rejeitar whatsapp com letras', () => {
      cy.get('input[name="whatsapp"]').type('11ABC987654321');
      cy.get('input[name="whatsapp"]').invoke('val')
        .then(val => {
          // Apenas números devem estar presentes
          expect(val).to.match(/^\d+$/);
        });
    });
  });

  describe('Validação - Data', () => {
    beforeEach(() => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');
    });

    it('Deve rejeitar data no passado', () => {
      cy.get('input[name="nome"]').type('Maria Silva');
      cy.get('input[name="email"]').type('maria@email.com');
      cy.get('input[name="whatsapp"]').type('11987654321');
      cy.get('input[name="data"]').type('2020-01-01T10:00');

      cy.get('button[type="submit"]').click();
      cy.get('.field-error').should('contain', 'futuro');
    });

    it('Deve rejeitar data vazia', () => {
      cy.get('input[name="nome"]').type('Maria Silva');
      cy.get('input[name="email"]').type('maria@email.com');
      cy.get('input[name="whatsapp"]').type('11987654321');

      cy.get('button[type="submit"]').click();
      cy.get('.field-error').should('contain', 'Data');
    });
  });

  describe('Feedback Visual', () => {
    beforeEach(() => {
      cy.get('.hero .btn').click();
      cy.get('.modal-overlay.active').should('be.visible');
    });

    it('Deve mostrar erro quando submeter formulário inválido', () => {
      cy.get('button[type="submit"]').click();
      cy.get('.modal-message.error').should('be.visible');
      cy.get('.modal-message.error').should('contain', 'corrija');
    });

    it('Deve desabilitar botão enquanto envia', () => {
      // Preencher formulário válido
      cy.get('input[name="nome"]').type('Maria Silva');
      cy.get('input[name="email"]').type('maria@email.com');
      cy.get('input[name="whatsapp"]').type('11987654321');
      cy.get('input[name="data"]').type('2026-03-20T14:30');

      // Submeter
      cy.get('button[type="submit"]').click();

      // Botão deve estar desabilidado
      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('.modal-message.loading').should('be.visible');
    });
  });
});

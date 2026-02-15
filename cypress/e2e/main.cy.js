describe('Testes E2E - Página Principal', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // Testes do Header
  describe('Header - Logo e Navegação', () => {
    it('Deve exibir o logo redondo', () => {
      cy.get('.logo-btn').should('be.visible');
      cy.get('.logo-img').should('have.attr', 'src', 'image.png');
    });

    it('Deve ter links de navegação', () => {
      cy.get('header .menu li').should('have.length.at.least', 2);
      cy.get('header a:contains("Sobre")').should('exist');
      cy.get('header a:contains("Contato")').should('exist');
    });

    it('Deve ter botão dark mode', () => {
      cy.get('.dark-mode-btn').should('be.visible');
    });
  });

  // Testes do Dark Mode
  describe('Dark Mode', () => {
    it('Deve alternar dark mode', () => {
      // Light mode padrão
      cy.get('body').should('not.have.class', 'dark-mode');

      // Clicar botão dark mode
      cy.get('.dark-mode-btn').click();
      cy.get('body').should('have.class', 'dark-mode');

      // Volta para light mode
      cy.get('.dark-mode-btn').click();
      cy.get('body').should('not.have.class', 'dark-mode');
    });

    it('Dark mode deve persistir no reload', () => {
      // Ativar dark mode
      cy.get('.dark-mode-btn').click();
      cy.get('body').should('have.class', 'dark-mode');

      // Reload page
      cy.reload();
      cy.get('body').should('have.class', 'dark-mode');
    });
  });

  // Testes do Hero
  describe('Hero Section', () => {
    it('Deve exibir seção hero', () => {
      cy.get('.hero').should('be.visible');
      cy.get('.hero h2').should('exist');
    });

    it('Deve ter botão de agendamento', () => {
      cy.get('.hero .btn').should('be.visible');
    });
  });
});

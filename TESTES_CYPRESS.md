# 🧪 Guia de Testes com Cypress

## 📦 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Instalar Cypress (já incluído em devDependencies)
```bash
npm install cypress --save-dev
```

---

## 🚀 Executar Testes

### Modo Headless (CI/CD)
```bash
npm test
# ou
npm run test
```

### Modo Interativo (Desenvolvimento)
```bash
npm run test:open
```

Isso abre o Cypress Test Runner onde você pode ver os testes em tempo real.

### Rodar teste específico
```bash
npx cypress run --spec cypress/e2e/main.cy.js
```

### Rodar com browser específico
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

---

## 📁 Estrutura dos Testes

```
cypress/
├── e2e/
│   ├── main.cy.js           # Testes do Header, Dark Mode, Hero
│   ├── agendamentos.cy.js   # Testes do Modal e Validações
│   └── api.cy.js            # Testes da API REST
├── support/
│   └── e2e.js               # Configurações globais e commands
└── cypress.config.js        # Configuração do Cypress
```

---

## 🧪 Testes Implementados

### 1. **main.cy.js** - Interface Principal
- ✅ Logo está visível
- ✅ Links de navegação existem
- ✅ Botão dark mode presente
- ✅ Dark mode alterna corretamente
- ✅ Dark mode persiste no reload
- ✅ Seção Hero visível
- ✅ Botão de agendamento existe

**Executar:**
```bash
npx cypress run --spec cypress/e2e/main.cy.js
```

### 2. **agendamentos.cy.js** - Modal e Validações
- ✅ Abrir/fechar modal
- ✅ Validar nome (rejeita números)
- ✅ Validar email (formato correto)
- ✅ Validar WhatsApp (10-11 dígitos)
- ✅ Validar data (futura apenas)
- ✅ Feedback visual durante envio
- ✅ Botão desabilidado enquanto envia

**Executar:**
```bash
npx cypress run --spec cypress/e2e/agendamentos.cy.js
```

### 3. **api.cy.js** - Testes de API
- ✅ Criar agendamento válido (201)
- ✅ Rejeitar dados inválidos (400)
- ✅ Listar agendamentos (GET)
- ✅ Rate limiting (HTTP 429)
- ✅ Integridade dos dados
- ✅ Sanitização contra XSS

**Executar:**
```bash
npx cypress run --spec cypress/e2e/api.cy.js
```

---

## 🔧 Commands Customizados

### fillAgendamentoForm
Preenche o formulário de agendamento automaticamente.

**Uso:**
```javascript
cy.fillAgendamentoForm({
  nome: 'Maria Silva',
  email: 'maria@email.com',
  whatsapp: '11987654321',
  servico: 'Facial',
  data: '2026-03-20T14:30',
  mensagem: 'Mensagem opcional'
});
```

### Adicionar seu próprio comando
Editar `cypress/support/e2e.js`:
```javascript
Cypress.Commands.add('loginAdmin', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
```

---

## 🔐 Pré-requisitos para Testes

### 1. Servidor rodando
```bash
npm start
# ou
node server-novo.js
```

Servidor deve estar na porta 3000.

### 2. Banco de dados
A pasta `database/` será criada automaticamente com `agendamentos.db`.

### 3. Navegador
Chrome/Chromium instalado (Cypress usa por padrão).

---

## 📊 Resultado de Testes

### Passar ✅
```
15 passing (5s)
```

### Falhar ❌
```
2 failing
1) Deve rejeitar email inválido
```

Cypress mostra:
- Screenshot do erro
- Vídeo da execução (se configurado)
- Stack trace completo

---

## 🚀 CI/CD - GitHub Actions

Testes rodam automaticamente quando:
- ✅ Fazer push para `main` ou `develop`
- ✅ Abrir Pull Request
- ✅ Fazer commit

### Status no GitHub
Vejo na badge do README:
```
[![Tests](https://github.com/seu-usuario/seu-repo/actions/workflows/ci-cd.yml/badge.svg)](...)
```

### Workflow (`.github/workflows/ci-cd.yml`)

1. **Setup** - Configura Node.js
2. **Install** - Instala dependências
3. **Build** - Compila projeto (se aplicável)
4. **Lint** - Verifica código
5. **Tests** - Executa Cypress
6. **Security Audit** - Verifica vulnerabilidades
7. **Deploy Preview** - Build para staging (develop)
8. **Deploy Production** - Deploy para produção (main)

### Ver resultados
https://github.com/seu-usuario/seu-repo/actions

---

## 🐛 Debugging

### Pausar teste
```javascript
cy.pause(); // Pausa a execução
```

### Debug no console
```javascript
cy.get('.modal-content').debug(); // Mostra seletor no console
```

### Tirar screenshot manualmente
```javascript
cy.screenshot('minha-screenshot');
```

### Modo Debug
```bash
npx cypress run --debug
```

---

## 📈 Boas Práticas

### ✅ Faça
- Usar data-testid para elementos críticos
- Esperar elementos carregarem (Cypress aguarda)
- Testar desde a perspectiva do usuário
- Nomes descritivos para testes

### ❌ Evite
- Hardcoded waits (`cy.wait(5000)`)
- Testar implementação (testar comportamento)
- Testes interdependentes
- Assertions no meio do teste (agrupe no final)

---

## 🔄 Workflow de Desenvolvimento

1. **Fazer mudança no código**
   ```bash
   git checkout -b feature/minha-feature
   ```

2. **Escrever teste primeiro (TDD)**
   ```bash
   npm run test:open
   ```

3. **Ver teste falhar**
   ```
   1 failing - expectedElement not found
   ```

4. **Implementar funcionalidade**
   ```bash
   # Editar src/components/...
   ```

5. **Ver teste passar ✅**
   ```
   1 passing
   ```

6. **Fazer commit**
   ```bash
   git add .
   git commit -m "✨ Nova feature com testes"
   git push origin feature/minha-feature
   ```

7. **abrir PR** → GitHub Actions roda testes automaticamente

---

## 📚 Recursos

- [Documentação Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)

---

## ✨ Próximos Passos

1. ✅ Cypress configurado
2. ✅ Testes E2E implementados
3. ✅ CI/CD com GitHub Actions
4. ⏳ Adicionar mais testes de validação
5. ⏳ Integração com Codecov
6. ⏳ Testes de performance
7. ⏳ Testes visuais (Visual Regression)

---

**Status:** 🟢 Pronto para usar

**Versão:** v1.0  
**Data:** 15/02/2026

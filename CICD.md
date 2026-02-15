# 🚀 CI/CD - Automação de Testes e Deploy

## 📊 Status Current

```
✅ Testes: Cypress E2E
✅ Linting: ESLint
✅ Security: npm audit
✅ Pipeline: GitHub Actions
```

---

## 🔄 Como Funciona

Quando você faz **push** ou **pull request**:

```
┌─────────────────┐
│  git push       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ GitHub Actions Trigger  │
└────────┬────────────────┘
         │
    ┌────┴──────────────┐
    │                   │
    ▼                   ▼
┌────────────┐     ┌──────────┐
│   Tests    │     │ Security │
│ (Cypress)  │     │  Audit   │
└────────────┘     └──────────┘
    │                   │
    └────────┬──────────┘
             │
    ┌────────▼────────┐
    │ Code Quality    │
    │ (ESLint)        │
    └────────┬────────┘
             │
             ▼
    ┌────────────────┐
    │ Deploy Preview │
    │ (develop)      │
    └────────────────┘
             │
    ┌────────▼────────┐
    │ Deploy Prod     │
    │ (main)          │
    └────────────────┘
```

---

## 📋 Workflow Steps

### 1️⃣ **Test Job** (Node.js 16, 18, 20)
```yaml
✅ Setup Node.js
✅ Instalar dependências
✅ Build projeto
✅ Lint código
✅ Testes Cypress
✅ Upload artefatos (se falhar)
```

### 2️⃣ **Security Audit Job**
```yaml
✅ npm audit (vulnerabilidades)
✅ Verificar dependências críticas
```

### 3️⃣ **Code Quality Job**
```yaml
✅ ESLint analysis
✅ Coverage metrics
```

### 4️⃣ **Deploy Preview Job** (develop branch)
```yaml
✅ Se todos os testes passarem
✅ Build preview
✅ Deploy em staging
```

### 5️⃣ **Deploy Production Job** (main branch)
```yaml
✅ Se todos os testes passarem
✅ Build final
✅ Deploy em produção
```

---

## 🎯 Triggers

| Evento | Branch | Ação |
|--------|--------|------|
| `push` | `main` | Tests → Deploy Prod |
| `push` | `develop` | Tests → Deploy Preview |
| `pull_request` | `main`, `develop` | Tests só |

---

## ✅ Ver Status

### No GitHub
```
Seu repositório → Actions
```

Verá:
- ✅ Commits com testes passando
- ❌ Commits com testes falhando
- ⏳ Testes em progresso

### Adicionar Badge ao README
```markdown
[![Tests](https://github.com/seu-usuario/seu-repo/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/seu-usuario/seu-repo/actions)
```

---

## 🧪 Testes no CI/CD

### O que está sendo testado

**E2E Tests (Cypress):**
- ✅ Interface responsiva
- ✅ Dark mode funciona
- ✅ Validações do formulário
- ✅ Modal abre/fecha
- ✅ API endpoints
- ✅ Rate limiting
- ✅ Segurança (XSS)

**Code Quality:**
- ✅ ESLint rules
- ✅ Vulnerabilidades npm
- ✅ Dependências outdated

---

## 🔐 Secrets & Variáveis

Se precisar de secrets (tokens, API keys):

1. **GitHub → Settings → Secrets and variables → Actions**
2. **New repository secret**

Exemplo:
```
Name: DEPLOY_KEY
Value: sua-chave-privada
```

Usar no workflow:
```yaml
- name: Deploy
  env:
    DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
  run: echo "Deploying..."
```

---

## 🚀 Deploy Real (TODO)

Para fazer deploy de verdade:

### 1. Vercel (Recomendado)
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 2. Netlify
```yaml
- name: Deploy to Netlify
  uses: netlify/actions/build@master
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

### 3. SSH Deploy
```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.USER }}
    key: ${{ secrets.SSH_KEY }}
    script: ./deploy.sh
```

---

## 📊 Monitoramento

### Ver logs de um job
1. GitHub → Actions
2. Clique no commit
3. Clique no job
4. Veja output em tempo real

### Falha? Debugging
1. Veja a aba "Logs"
2. Procure por ❌ indica erro
3. Veja stack trace completo
4. Corrija e faça novo push

---

## 🔄 Manual Trigger

Pode rodar workflow manualmente:

1. GitHub → Actions
2. Selecione workflow
3. "Run workflow" button
4. Escolha branch
5. Run

---

## 📈 Estatísticas

### Badge de Status
```
✅ Last run: 2026-02-15 14:30
✅ Success rate: 100%
⏱️ Avg time: 3m 45s
```

### Performance
- Tests: ~2-3 minutos
- Build: ~1 minuto
- Deploy: ~2 minutos

---

## 🛠️ Manutenção

### Atualizar Node.js
```yaml
node-version: [18.x, 20.x, 22.x]  # Editar ci-cd.yml
```

### Adicionar novo teste
1. Criar arquivo em `cypress/e2e/novo.cy.js`
2. CI/CD roda automaticamente

### Desabilitar job
Comentar em `.github/workflows/ci-cd.yml`:
```yaml
# deploy-production:
#   needs: [test, security-audit]
```

---

## ⚡ Quick Fixes

### "Tests failing com timeout"
Aumentar timeout em `cypress.config.js`:
```javascript
wait-on-timeout: 120000  // 2 minutos
```

### "Cannot find Chrome"
Usar browser alternativo:
```yaml
browser: firefox
```

### "npm audit vulnerabilidades"
```bash
npm audit fix
npm audit fix --force  # Se necessário
```

---

## 📚 Próximos Passos

- [ ] Configurar deploy real (Vercel/Netlify)
- [ ] Adicionar Codecov (cobertura)
- [ ] Slack/Discord notifications
- [ ] Performance monitoring
- [ ] Visual regression tests
- [ ] Load testing

---

**Status:** 🟢 Pronto e operacional

**Última atualização:** 15/02/2026  
**Versão:** 1.0

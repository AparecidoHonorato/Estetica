# 🔐 Segurança - Guia Completo

> Guia de boas práticas de segurança para o projeto Lumena Estética

---

## ⚠️ Falhas de Segurança Críticas (Resolvidas)

### 1. Credenciais Expostas
**Status**: ✅ CORRIGIDO

**Problema**:
- `credentials.json` foi encontrado no repositório
- Qualquer pessoa poderia usar suas credenciais do Google Calendar
- Risco de invasão e custos financeiros

**Solução Implementada**:
```bash
# Remover do versionamento
git rm --cached credentials.json

# Adicionar ao .gitignore
echo "credentials.json" >> .gitignore

# Fazer commit
git add .gitignore
git commit -m "sec: remove credentials from version control"

# IMPORTANTE: Revogar chaves no Google Cloud Console
# E gerar chaves novas
```

### 2. node_modules no Repositório
**Status**: ✅ CORRIGIDO

**Problema**:
- Pasta `node_modules` foi versionada
- Repositório muito grande (centenas de MB)
- Impede build limpo

**Solução Implementada**:
```bash
# Verificar que não está mais versionado
git status | grep node_modules  # Não deve aparecer

# Se estivesse, remover com:
git rm -r --cached node_modules
```

---

## 🔒 Boas Práticas Implementadas

### 1. Variáveis de Ambiente

**✅ Fazer**:
```bash
# Criar .env
PORT=3000
DB_PATH=./database/agendamentos.db

# Adicionar .env ao .gitignore
```

**❌ Nunca**:
```javascript
// ❌ ERRADO: Senha no código
const password = "minha-senha-123";

// ✅ CORRETO: Usar variáveis de ambiente
const password = process.env.DB_PASSWORD;
```

### 2. Validação Dupla

**Frontend** (Cliente):
- Validação imediata do usuário
- Melhor UX

**Backend** (Servidor):
- Validação definitiva
- Proteção contra requisições alteradas

```javascript
// ✅ CORRETO: Ambas as camadas
// Frontend: No SchedulingModal.jsx
// Backend: No server-novo.js
```

### 3. Rate Limiting

**Configurado**:
```javascript
const RATE_LIMIT = 5;              // 5 requisições
const RATE_LIMIT_WINDOW = 3600000; // 1 hora

// Retorna HTTP 429 após limite atingido
```

**Benefícios**:
- Protege contra brute force
- Protege contra DDoS
- Reduz spam

### 4. Sanitização XSS

**SQL Injection**:
```javascript
// ✅ CORRETO: Prepared statements
db.run("INSERT INTO agendamentos (nome) VALUES (?)", [nome]);

// ❌ ERRADO: Concatenação
db.run(`INSERT INTO agendamentos (nome) VALUES ('${nome}')`);
```

**HTML Escape**:
```javascript
// ✅ CORRETO: React escapa automaticamente
<h1>{userData.name}</h1>  // Safe

// ❌ ERRADO: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{__html: userData.html}} />
```

---

## 🛡️ Checklist de Deployment

### Antes de fazer deploy em produção:

- [ ] **Criptografia**: HTTPS configurado
- [ ] **Variáveis**: Todas as `.env` configuradas no servidor
- [ ] **Dados sensíveis**: Nenhum em arquivos versionados
- [ ] **Logs**: Configurados sem expor dados pessoais
- [ ] **CORS**: Restrito só aos domínios conhecidos
- [ ] **Rate limit**: Aumentado se necessário
- [ ] **Banco de dados**: Backup feito
- [ ] **Monitoramento**: Alertas configurados
- [ ] **Testes**: Cypress passando
- [ ] **Performance**: Lighthouse >90

### Exemplo de Deploy Seguro

```bash
# 1. Build
npm run build

# 2. Verificar que .env não está em dist
ls -la dist/ | grep env  # Não deve aparecer

# 3. Deploy apenas a pasta 'dist'
# Nunca fazer deploy da raiz do projeto

# 4. Configurar variáveis no servidor
# (Netlify, Vercel, Railway, etc)
```

---

## 🔑 Gerenciamento de Credenciais Google

### Se usar Google Calendar:

**1. Criar projeto no Google Cloud**
```bash
# https://console.cloud.google.com
# Criar novo projeto
# Ativar API de calendário
# Criar credenciais (Service Account)
```

**2. Fazer download de credentials.json**
```bash
# Arquivo contém CHAVES SECRETAS
# NUNCA fazer push para GitHub
```

**3. Adicionar ao .gitignore**
```bash
echo "credentials.json" >> .gitignore
```

**4. Se já foi commitado por erro**
```bash
# Remover do histórico (difícil, leia bem)
git rm --cached credentials.json
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch credentials.json' \
  --prune-empty --tag-name-filter cat -- --all

# REVOGAR chaves no Google Cloud Console
# Gerar chaves novas
```

---

## 📊 Monitoramento e Logs

### Informações Seguras para Logar

**✅ SEGURO**:
```javascript
console.log(`Agendamento criado para IP: ${ip}`);            // IP anônimo OK
console.log(`Serviço: ${servico}`);                          // Dados públicos OK
console.log(`Status da requisição: ${response.status}`);     // Techs OK
```

**❌ PERIGOSO**:
```javascript
console.log(`Email: ${email}`);                              // PII!
console.log(`Full formData: ${JSON.stringify(formData)}`);   // Expõe dados!
console.log(`Header: ${JSON.stringify(headers)}`);           // Pode ter tokens!
```

### Logs do Sistema

```bash
# Verificar logs do servidor
tail -f server.log | grep "ERRO"

# Não incluir informações pessoais
# Não logar passwords ou tokens
# Usar IDs anônimos quando possível
```

---

## 🚨 Relatar Vulnerabilidades

Se você encontrar uma vulnerabilidade:

**1. NÃO faça um issue público**
2. Envie email para [seu-email]@example.com com:
   - Descrição do problema
   - Passos para reproduzir
   - Impacto potencial
3. Aguarde confirmação
4. Trabalhe junto no fix
5. Divulgar apenas após correção

---

## 📚 Referências de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerously-set-innerhtml)

---

## 🔄 Política de Dependências

### Atualizações

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix

# Atualizar para versões menores/patches
npm update

# Atualizar maiores (cuidado!)
npm outdated
```

### Dependências Críticas

- `express` - Framework web
- `sqlite3` - Banco de dados
- `react` - UI framework
- `vite` - Build tool

Atualize com cuidado, sempre testar antes.

---

**Versão**: 1.0  
**Última atualização**: Fevereiro 2026  
**Próxima revisão**: Maio 2026

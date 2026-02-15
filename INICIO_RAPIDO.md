# ⚡ Início Rápido - Servidor Melhorado

## 🎯 Objetivo
Você tem agora um servidor **completo, seguro e validado** pronto para usar.

## 🚀 Em 1 Minuto

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor
```bash
node server-novo.js
```

### 3. Acessar no navegador
```
http://localhost:3000
```

✅ **Pronto!** Seu servidor está rodando.

---

## ✨ O Que Mudou

| Item | Antes | Agora |
|------|-------|-------|
| Validação Nome | ❌ Aceitava números | ✅ Só letras e espaços |
| Validação Email | ❌ Sem regex | ✅ RFC5322 validado |
| Validação Telefone | ❌ Aceitava letras | ✅ Só números |
| Campos Vazios | ❌ Aceitava | ✅ Rejeita com erro |
| Dark Mode | ❌ CSS quebrado | ✅ Perfeito WCAG AA |
| Spam | ❌ Sem proteção | ✅ Rate limit 5/hora |
| Logs | ❌ Nenhum | ✅ Estruturados |
| Erros | ❌ Confusos | ✅ Claros e úteis |
| Feedback | ❌ Nenhum | ✅ Loading/Sucesso/Erro |

---

## 📋 Checklist de Verificação

Quando iniciar o servidor, você deve ver:

```
==================================================
🚀 SERVIDOR INICIADO COM SUCESSO
==================================================
📍 Acesse: http://localhost:3000
🔒 Rate Limit: 5 requisições por hora/IP
💾 Database: ./database/agendamentos.db
==================================================

✅ Banco de dados conectado
✅ Tabela agendamentos verificada/criada
⚠️  credentials.json não encontrado (isso é OK)
```

**Se ver tudo isso = SUCESSO! ✅**

---

## 🧪 Testar a Validação

### Teste 1: Enviar Agendamento Válido ✅

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "whatsapp": "11987654321",
    "servico": "Facial",
    "data": "2026-03-20",
    "hora": "14:30",
    "mensagem": "Primeira vez"
  }'
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "id": 1,
  "mensagem": "✅ Agendamento realizado!",
  "eventoId": null
}
```

### Teste 2: Email Inválido ❌

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@invalido",
    "whatsapp": "11987654321",
    "servico": "Facial",
    "data": "2026-03-20",
    "hora": "14:30"
  }'
```

**Resposta esperada:**
```json
{
  "sucesso": false,
  "mensagem": "Email inválido (ex: seu@email.com)"
}
```

### Teste 3: Nome com Números ❌

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva 123",
    "email": "maria@email.com",
    "whatsapp": "11987654321",
    "servico": "Facial",
    "data": "2026-03-20",
    "hora": "14:30"
  }'
```

**Resposta esperada:**
```json
{
  "sucesso": false,
  "mensagem": "Nome deve conter apenas letras e espaços"
}
```

### Teste 4: Telefone com Letras ❌

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "whatsapp": "ABC-1198765432",
    "servico": "Facial",
    "data": "2026-03-20",
    "hora": "14:30"
  }'
```

**Resposta esperada:**
```json
{
  "sucesso": false,
  "mensagem": "WhatsApp inválido (10-11 dígitos)"
}
```

### Teste 5: Rate Limiting (Proteção contra Spam) 🔒

Enviar 5 requisições válidas = OK
Enviar 6ª requisição = HTTP 429

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com",...}' \
  -v
```

**Na 6ª: Verá `HTTP/1.1 429 Too Many Requests`**

---

## 📱 Testar Dark Mode

1. Abra http://localhost:3000
2. Clique no botão 🌙 no header
3. Veja as cores mudar para:
   - Background preto: `#111`
   - Texto claro: `#eee`
   - Dourado: `#d4af37`

**Contraste verificado? WCAG AA ✅**

---

## 📊 Monitorar Logs

Abra o terminal onde servidor está rodando e procure por:

```
📝 [15/02/2026 14:30:45] Nova requisição de agendamento
   IP: 192.168.1.100
   Nome: Maria Silva, Email: maria@email.com

✅ Validação OK
✅ Agendamento #42 salvo no banco
✅ Evento adicionado ao Google Calendar
✅ Resposta enviada para cliente
```

---

## 🎯 Próximas Ações Recomendadas

### Hoje
- ✅ Testar validações acima
- ✅ Verificar dark mode
- ✅ Verificar responsividade no mobile

### Esta Semana
- ⏳ Deploy em HTTPS (Let's Encrypt)
- ⏳ Configurar Google Calendar (credentials.json)
- ⏳ Enviar email de confirmação com nodemailer

### Este Mês
- ⏳ Criar dashboard de admin
- ⏳ Integrar WhatsApp (Twilio)
- ⏳ Fazer backup automático do banco

---

## 🆘 Problemas?

### "Port 3000 in use"
```bash
# Mudar porta em .env
PORT=3001 node server-novo.js
```

### "Error: Cannot find module 'express'"
```bash
npm install
# Ou se tiver versão antiga
npm install express sqlite3 googleapis
```

### "Banco de dados não conecta"
```bash
# A pasta database/ será criada automaticamente
ls -la database/
# Deve ter: agendamentos.db
```

### "Dark mode não funciona"
```bash
# Limpar localStorage do navegador
# DevTools > Application > Cookies > localStorage > Delete All
```

---

## 📚 Documentação Completa

- **GUIA_FIXES.md** - Todas as correções implementadas
- **README.md** - Documentação completa do projeto
- **server-novo.js** - Código comentado do backend

---

## ✅ Status Final

```
🚀 Servidor: ATIVO
✅ Validações: IMPLEMENTADAS
✅ Dark Mode: FUNCIONANDO
✅ Rate Limit: ATIVO
✅ Logs: ESTRUTURADOS
✅ Responsividade: OTIMIZADA
```

**Parabéns! Seu projeto está pronto! 🎉**

---

**Última atualização:** 15/02/2026  
**Versão:** 2.0

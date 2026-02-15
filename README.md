# 🌺 Lumena Estética - Projeto Web Melhorado

> Plataforma de agendamento online para serviços de estética. Versão 2.0 com validações, segurança e UX otimizada.

## ✨ Melhorias Implementadas (v2.0)

### Segurança & Backend
- ✅ **Rate Limiting**: 5 requisições por IP/hora (proteção contra spam)
- ✅ **Validação Rigorosa**: Todos os campos validados no frontend e backend
- ✅ **Sanitização**: Proteção contra XSS
- ✅ **Logs Estruturados**: Rastreamento completo de requisições
- ✅ **HTTP Status Codes**: 201, 400, 429, 500 apropriados

### Frontend & UX
- ✅ **Feedback Visual**: Loading, sucesso, erro com ícones e cores
- ✅ **Filtro de Entrada**: Nome (só letras), Telefone (só números)
- ✅ **Dark Mode Corrigido**: CSS sintaxe perfeita, contraste WCAG AA
- ✅ **Responsivo**: Mobile-first, media queries até 480px

### Validação de Dados
```javascript
// Nome: 3-100 caracteres, apenas letras
// Email: RFC5322 + máx 100 chars
// Telefone: 10-11 dígitos
// Data: Sempre futura
// Serviço: Whitelist (Facial, Corporal, Unhas)
// Mensagem: Máx 500 caracteres
```

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js v14+
- npm ou yarn

### Passos

1. **Instalar dependências**
```bash
npm install
```

2. **Iniciar o servidor**
```bash
node server-novo.js
```

3. **Acessar în navegador**
```
http://localhost:3000
```

### Se quiser usar Google Calendar (opcional)
```bash
# 1. Cria conta Google Cloud
# 2. Gera credentials.json
# 3. Coloca no root do projeto
# Servidor detecta automaticamente
```

## 📋 Estrutura de Arquivos

```
📁 estetica/
├── 📄 index.html              # Frontend principal
├── 📄 server-novo.js          # Backend Node.js (melhorado)
├── 📄 style.css               # Estilos (sintaxe corrigida)
├── 📄 .env                   # Configurações
├── 📄 GUIA_FIXES.md          # Documentação de correções
├── 📄 README.md              # Este arquivo
│
├── 📁 src/
│   ├── 📄 main.jsx
│   ├── 📄 App.jsx
│   ├── 📄 App.css
│   ├── 📄 index.css
│   └── 📁 components/
│       ├── Header.jsx
│       ├── Hero.jsx
│       ├── Services.jsx
│       ├── About.jsx
│       ├── Footer.jsx
│       ├── SchedulingModal.jsx
│       └── ResponsiveImage.jsx
│
├── 📁 database/
│   └── agendamentos.db        # SQLite (criado automaticamente)
│
└── 📁 public/
    └── imagens e assets
```

## 🔒 Proteção contra Spam

O servidor implementa rate limiting automático:

```javascript
// Máximo de requisições
const RATE_LIMIT = 5;

// Período de limite
const RATE_LIMIT_WINDOW = 3600000; // 1 hora

// Resposta quando limite atingido
// HTTP 429: "Muitas requisições. Tente novamente em 1 hora."
```

### Como funciona
1. Servidor identifica IP do cliente
2. Conta requisições por hora
3. Depois de 5 requisições, retorna HTTP 429
4. Contador reseta após 1 hora

## 📊 Logs do Servidor

### Exemplos

**Requisição Recebida:**
```
📝 [15/02/2026 14:30:45] Nova requisição de agendamento
   IP: 192.168.1.100
   Nome: Maria Silva, Email: maria@email.com
```

**Sucesso:**
```
✅ Validação OK
✅ Agendamento #42 salvo no banco
✅ Evento adicionado ao Google Calendar
✅ Resposta enviada para cliente
```

**Erro:**
```
❌ Validação falhou: Email inválido (ex: seu@email.com)
```

## 📱 Responsividade

### Quebras de Layout

| Tela | Mudanças |
|------|----------|
| **Desktop** (>768px) | Layout horizontal, menu desktop |
| **Tablet** (768px) | Menu adapta, cards em coluna dupla |
| **Mobile** (480-767px) | Menu empilhado, 1 coluna |
| **Pequeno** (<480px) | Fonte reduzida, espaço mínimo |

### Testar
```bash
# Chrome DevTools > F12 > Ctrl+Shift+M
# Ou redimensionar janela
```

## 🎨 Tema Dark Mode

Perfeito para usar à noite. Implementado com:
- Background: `#111` (quase preto)
- Texto: `#eee` (quase branco)
- Acentos: `#d4af37` (dourado elegante)
- Contraste: **Superior a 4.5:1** ✅ WCAG AA

**Como habilitar:**
Clique no botão 🌙 no header

## 📡 API Reference

### POST /api/agendamentos
Cria novo agendamento.

**Request:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "whatsapp": "11987654321",
  "servico": "Facial",
  "data": "2026-02-20",
  "hora": "14:30",
  "mensagem": "Tenho pele sensível"
}
```

**Response (201):**
```json
{
  "sucesso": true,
  "id": 42,
  "mensagem": "✅ Agendamento realizado!",
  "eventoId": "abc123xyz"
}
```

**Response (400):**
```json
{
  "sucesso": false,
  "mensagem": "Email inválido (ex: seu@email.com)"
}
```

**Response (429):**
```json
{
  "sucesso": false,
  "mensagem": "Muitas requisições. Tente novamente em 1 hora."
}
```

### GET /api/agendamentos
Lista últimos 100 agendamentos.

**Response:**
```json
[
  {
    "id": 42,
    "nome": "Maria Silva",
    "servico": "Facial",
    "data": "2026-02-20",
    "hora": "14:30",
    "data_criacao": "2026-02-15 14:22:30"
  },
  ...
]
```

### DELETE /api/agendamentos/:id
Deleta agendamento (requer token admin).

## 🐛 Problemas Comuns

### "Erro ao conectar com o servidor"
- Servidor parou? `npm start` ou `node server-novo.js`
- Porta 3000 em uso? Mudar em `.env` → `PORT=3001`

### "Rate limit atingido"
- Normal! Esperar 1 hora ou mudar de IP/rede

### Dark mode não salva
- Verificar localStorage do navegador
- DevTools > Application > Cookies > localStorage

### Email não chega
- Configurar Google Calendar (credentials.json)
- Checar logs do servidor

## 🔧 Configuração Avançada

### Arquivo `.env`
```env
PORT=3000
ADMIN_TOKEN=seu-token-super-seguro
GOOGLE_CREDENTIALS_PATH=./credentials.json
RATE_LIMIT_REQUESTS=5
RATE_LIMIT_WINDOW_HOURS=1
```

### Variáveis de Ambiente
```bash
# Iniciar em porta diferente
PORT=3001 node server-novo.js

# Com token admin
ADMIN_TOKEN=secreto123 RATE_LIMIT_REQUESTS=10 node server-novo.js
```

## 💾 Banco de Dados

SQLite local (automático).

### Tabela `agendamentos`
```sql
id              INTEGER PRIMARY KEY
nome            TEXT NOT NULL
email           TEXT NOT NULL
whatsapp        TEXT NOT NULL
servico         TEXT NOT NULL
data            TEXT NOT NULL
hora            TEXT NOT NULL
mensagem        TEXT
ip_origem       TEXT
data_criacao    DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Backup
```bash
# Copiar arquivo database/agendamentos.db
cp database/agendamentos.db backups/agendamentos.db
```

## 📈 Próximos Passos

| Prioridade | Tarefa | Status |
|-----------|--------|---------|
| 🔴 Alta | Deploy em HTTPS | ⏳ TODO |
| 🔴 Alta | Confirmar agendamento por email | ⏳ TODO |
| 🟡 Média | Dashboard de admin | ⏳ TODO |
| 🟡 Média | Integração WhatsApp | ⏳ TODO |
| 🟢 Baixa | Analytics e relatórios | ⏳ TODO |

## 📞 Suporte

**Problemas com validação?**
→ Ver [GUIA_FIXES.md](GUIA_FIXES.md)

**Dúvidas sobre API?**
→ Verificar seção "API Reference"

**Quero personalizar?**
→ Editar `style.css` ou `.jsx` conforme necessário

## 📄 Licença

Projeto pessoal. Sinta-se livre para usar e modificar.

---

**Projeto:** Lumena Estética  
**Versão:** 2.0  
**Última atualização:** 15/02/2026  
**Status:** ✅ Pronto para uso e produção

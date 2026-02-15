# 🌺 Lumena Estética - Sistema de Agendamento Online

> Plataforma moderna de agendamento para serviços de estética com **React + Vite** e backend **Express.js**. 
> Validação completa, segurança, dark mode e totalmente responsivo.

---

## 🎯 Visão Geral

**Lumena Estética** é um sistema web profissional para agendamento de serviços de beleza, desenvolvido com:

- **Frontend**: React 18 + Vite (HMR em tempo real)
- **Backend**: Express.js com Node.js
- **Banco de Dados**: SQLite3
- **Segurança**: Rate limiting, validação dupla, sanitização XSS
- **UX**: Dark mode nativo, responsivo 360px-1920px, feedback visual completo

---

## ⚡ Quick Start

### Requisitos
- **Node.js** v16+ ([Download](https://nodejs.org))
- **npm** v7+

### Instalação (1 minuto)

```bash
# 1. Clonar e entrar no projeto
git clone https://github.com/AparecidoHonorato/Estetica.git
cd Estetica

# 2. Instalar dependências
npm install

# 3. Iniciar em desenvolvimento (em 2 abas de terminal)

# Terminal 1: Servidor Express (porta 3000)
node server-novo.js

# Terminal 2: Vite Dev (porta 5173)
npm run dev
```

**Acesso**: Abra http://localhost:5173 no navegador

---

## 🚀 Comandos Disponíveis

```bash
# Iniciar desenvolvimento (Vite hot reload)
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Executar testes Cypress (opcional)
npm run test:e2e
```

---

## 📁 Estrutura do Projeto

```
Estetica/
│
├── 📄 index.html                    # Template HTML
├── 📄 style.css                     # Estilos globais (1200+ linhas)
├── 📄 script.js                     # JS vanilla (fallback)
├── 📄 .gitignore                    # Segurança (node_modules, env, etc)
├── 📄 .env                          # Variáveis de ambiente
├── 📄 package.json                  # Dependências e scripts
├── 📄 vite.config.js               # Config Vite com proxy
│
├── 🚀 server-novo.js                # EXPRESS BACKEND
│   ├── POST /api/agendamentos       # Criar agendamento
│   ├── GET /api/agendamentos/:id    # Consultar
│   ├── Rate limiting                # 5 req/hora por IP
│   └── Google Calendar (opcional)
│
├── 📁 src/ (React)
│   ├── main.jsx                     # Entry point
│   ├── App.jsx                      # Componente root
│   └── components/
│       ├── Header.jsx               # Navbar + Dark mode
│       ├── Hero.jsx                 # CTA "Agende"
│       ├── Services.jsx             # Catálogo de serviços
│       ├── About.jsx                # Sobre a empresa
│       ├── Footer.jsx               # Rodapé
│       └── SchedulingModal.jsx      # ⭐ Modal de agendamento
│
├── 📁 database/
│   ├── db.js                        # Config SQLite
│   └── agendamentos.db              # Banco (criado automaticamente)
│
└── 📁 cypress/                      # E2E Tests
```

---

## ✨ Funcionalidades Principais

### 1. Sistema de Agendamento
- ✅ Modal elegante e responsivo
- ✅ Validação real-time em todos os campos
- ✅ Data picker com bloqueio de datas passadas
- ✅ Seletor de serviço (Facial, Corporal, Unhas)
- ✅ Mensagem opcional

### 2. Segurança
```
✓ Rate Limiting: 5 req/hora por IP
✓ Validação dupla (Frontend + Backend)
✓ SQL Injection: Prepared statements
✓ XSS: HTML escape e sanitização
✓ Logs estruturados com IP origem
```

### 3. Dark Mode
- ✅ Toggle no header
- ✅ Persiste em localStorage
- ✅ Contraste WCAG AA
- ✅ Transições smooth

### 4. Responsividade
- ✅ Mobile-first (360px-1920px)
- ✅ Touch-friendly
- ✅ Menu hambúrguer em small devices
- ✅ Imagens otimizadas

---

## 🔐 Segurança & Configuração

### `.gitignore` (CRÍTICO)

```
# Variáveis sensíveis - NUNCA COMMITAR
.env
.env.local
credentials.json

# Dependências - NUNCA COMMITAR
node_modules/
package-lock.json
yarn.lock

# Banco de dados local
database/*.db

# Logs e build
*.log
dist/
build/
```

### ⚠️ Google Calendar (Opcional)

Se quiser integrar com Google Calendar:

```bash
# 1. Gerar credentials.json no Google Cloud Console
# 2. IMPORTANTE: Adicionar ao .gitignore ANTES de commitar
# 3. Colocar na raiz do projeto

# Verificar que NÃO está versionado
git status | grep credentials  # Não deve aparecer

# Se já foi commitado por erro:
git rm --cached credentials.json
git commit -m "remove credentials.json"
```

---

## 📡 API REST

### POST /api/agendamentos
Criar novo agendamento.

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "whatsapp": "41999998888",
  "servico": "Facial",
  "data": "2026-03-01",
  "hora": "14:30",
  "mensagem": "Texto opcional..."
}
```

**Response (201):**
```json
{
  "sucesso": true,
  "id": 1,
  "mensagem": "Agendamento criado com sucesso"
}
```

**Response (400) - Validação:**
```json
{
  "sucesso": false,
  "mensagem": "WhatsApp inválido (10-11 dígitos)"
}
```

**Response (429) - Rate Limited:**
```json
{
  "sucesso": false,
  "mensagem": "Muitas requisições. Tente novamente em 1 hora."
}
```

---

## 🧪 Testes

```bash
# Rodar Cypress
npx cypress open

# Testes cobrem:
# ✓ Homepage load
# ✓ Modal open/close
# ✓ Form validation
# ✓ Submit agendamento
# ✓ API endpoints
```

---

## 🐛 Troubleshooting

### "Cannot find module '@vitejs/plugin-react'"
```bash
npm install @vitejs/plugin-react
```

### "EADDRINUSE: address already in use :::3000"
```bash
# Windows: matar processo
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou usar outra porta
set PORT=3001 && node server-novo.js
```

### "Modal não abre"
- Abrir console do navegador (F12)
- Verificar se servidor Express está rodando
- Verificar Network tab para erro de API

### "Dark mode não persiste"
```javascript
// No console:
localStorage.getItem('dark-mode')  // Deve retornar 'true' ou 'false'
```

---

## 🚢 Deploy

### Netlify (Frontend Only)

```bash
# Build
npm run build

# Deploy pasta 'dist'
# Drag-and-drop ou use netlify-cli
npm install -g netlify-cli
netlify deploy
```

### Railway / Render (Full Stack)

```bash
# Conectar repositório GitHub
# Build command:
npm install

# Start command:
node server-novo.js
```

---

## 📊 Validação de Dados

| Campo | Regra | Exemplo |
|-------|-------|---------|
| Nome | 3-100 chars, apenas letras | Maria Silva |
| Email | RFC válido, máx 100 chars | maria@exemplo.com |
| WhatsApp | 10-11 dígitos | 11987654321 |
| Data | Sempre futura | 2026-03-01 |
| Serviço | Facial, Corporal, Unhas | Facial |
| Mensagem | Máx 500 caracteres | Tenho pele sensível... |

---

## 💡 Próximas Melhorias

- [ ] Autenticação (JWT)
- [ ] Sistema de pagamento (Stripe)
- [ ] Painel administrativo
- [ ] Notificação WhatsApp
- [ ] Exportar calendário (iCal)

---

## 👨‍💻 Autor

**Aparecido Honorato**  
GitHub: [@AparecidoHonorato](https://github.com/AparecidoHonorato)

---

## 📄 Licença

MIT License

---

**Versão**: 2.1.0-react  
**Última atualização**: Fevereiro 2026  
**Status**: ✅ Pronto para produção

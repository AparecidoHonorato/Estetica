# 📱 Guia de Acesso via Celular

## Como Acessar a Aplicação no Seu Celular

A aplicação foi otimizada para funcionar perfeitamente em dispositivos móveis! Siga os passos abaixo para acessar.

### ✅ Requisitos
- Seu celular e computador na **mesma rede Wi-Fi**
- Node.js instalado no computador

### 📋 Passo a Passo

#### 1. **Inicie o Servidor**
No PowerShell ou terminal, navegue até o diretório do projeto e execute:

```powershell
npm start
```

Ou:

```powershell
node server-novo.js
```

#### 2. **Observe a Saída do Console**
Você verá algo como:

```
==================================================
🚀 SERVIDOR INICIADO COM SUCESSO
==================================================
💻 Local: http://localhost:3000
📱 Celular/Rede: http://192.168.1.100:3000
🔒 Rate Limit: 5 requisições por hora/IP
💾 Database: ./database/db.js
==================================================
```

⚠️ **Copie o endereço após "📱 Celular/Rede"** (ex: `http://192.168.1.100:3000`)

#### 3. **Acesse no Celular**

- Abra o navegador do seu celular (Chrome, Safari, Firefox, etc.)
- Digite o endereço IP que você copiou:
  ```
  http://192.168.1.100:3000
  ```
  *(substitua `192.168.1.100` pelo IP mostrado no console)*

- Pressione Enter e pronto! ✅

### 🎨 Recursos Móveis

A aplicação agora possui:

- ✅ **Menu Hambúrguer** - Para melhor navegação em celulares pequenos
- ✅ **Responsividade Completa** - Funciona em todos os tamanhos de tela
- ✅ **Modo Escuro** - Com tema para celular otimizado
- ✅ **Formulário Otimizado** - Campos com tamanho adequado para toques
- ✅ **Zoom Preventivo** - Inputs com font-size 16px para evitar zoom automático
- ✅ **Web App** - Pode ser adicionada à tela inicial (em alguns navegadores)

### ⚙️ Configuração do Servidor

Para desenvolvimento com Vite, você também pode usar:

```powershell
npm run dev
```

Isso iniciará:
- Vite Dev Server: `http://localhost:5173` (local)
- API Backend: `http://localhost:3000` (rede)

### 📲 Adicionar à Tela Inicial (Opcional)

**iPhone (Safari):**
1. Abra a página
2. Toque no ícone de compartilhamento
3. Selecione "Adicionar à Tela Principal"

**Android (Chrome):**
1. Toque no menu (⋮)
2. Selecione "Instalar app" ou "Adicionar à tela inicial"

### 🔧 Solução de Problemas

**P: Não consigo conectar do celular**
- ✅ Certifique-se de que ambos estão na mesma rede Wi-Fi
- ✅ Desative VPN se estiver usando
- ✅ Verifique o firewall do Windows (pode estar bloqueando)

**P: Aparece "Página não encontrada"**
- ✅ Verifique se o IP está correto
- ✅ Tente com o IP mostrado no console (não localhost)

**P: API não funciona no celular**
- ✅ Verifique se o servidor Node está rodando
- ✅ Verifique se a porta 3000 não está bloqueada

### 📊 Breakpoints Responsivos

A aplicação foi otimizada para:

| Tamanho | Breakpoint | Exemplos |
|---------|-----------|----------|
| Pequeno | < 360px | Celulares muito pequenos |
| Mobile | 480px | Celulares comuns |
| Tablet | 768px | Tablets, celulares grandes |
| Desktop | 1200px+ | Computadores |

---

**Dúvidas?** Consulte o console do navegador para mensagens de erro. 🐛

**Aproveite! 🎉**

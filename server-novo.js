import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';
import { google } from 'googleapis';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== MIDDLEWARES =====
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rate limiting simples (proteção contra spam)
const requestCounts = {};
const RATE_LIMIT = 5; // máximo 5 requisições
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // por 1 hora

// Middleware de rate limiting
const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  }
  
  const userData = requestCounts[ip];
  
  // Resetar contador se passou o tempo
  if (now > userData.resetTime) {
    userData.count = 0;
    userData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Verificar limite
  if (userData.count >= RATE_LIMIT) {
    console.warn(`⚠️ Rate limit atingido para IP ${ip}`);
    return res.status(429).json({
      sucesso: false,
      mensagem: 'Muitas requisições. Tente novamente em 1 hora.'
    });
  }
  
  userData.count++;
  next();
};

// Aplicar rate limiter apenas na rota de agendamentos
app.use('/api/agendamentos', rateLimiter);

// ===== DATABASE SETUP =====
const dbPath = path.join(__dirname, 'database', 'agendamentos.db');

// Criar pasta database se não existir
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('📁 Pasta database criada');
}

// ===== GOOGLE CALENDAR SETUP =====
let calendar = null;
try {
  const credentialsPath = path.join(__dirname, 'credentials.json');
  if (fs.existsSync(credentialsPath)) {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
    calendar = google.calendar({ version: 'v3', auth });
    console.log('✅ Google Calendar API configurado');
  } else {
    console.log('⚠️ credentials.json não encontrado');
  }
} catch (erro) {
  console.log('⚠️ Erro ao configurar Google Calendar:', erro.message);
}

// ===== VALIDAÇÕES =====
const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

const validarTelefone = (telefone) => {
  const apenasNumeros = telefone.replace(/\D/g, '');
  return apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
};

const validarNome = (nome) => {
  return nome.trim().length >= 3 && nome.trim().length <= 100;
};

const validarServico = (servico) => {
  const servicosValidos = ['Facial', 'Corporal', 'Unhas'];
  return servicosValidos.includes(servico);
};

const sanitizarTexto = (texto) => {
  return texto
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 500);
};

// ===== GOOGLE CALENDAR INTEGRATION =====
async function adicionarAoCalendarioAutomatico(nome, servico, data, hora, email) {
  if (!calendar) {
    console.log('ℹ️ Google Calendar não disponível');
    return null;
  }

  try {
    // Parse data e hora
    const [ano, mes, dia] = data.split('-');
    const [horas, minutos] = hora.split(':');
    
    const startTime = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), parseInt(horas), parseInt(minutos));
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);

    const evento = {
      summary: `Agendamento: ${nome} - ${servico}`,
      description: `Serviço: ${servico}\nCliente: ${nome}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Sao_Paulo'
      },
      attendees: [{ email: email }],
      reminders: { useDefault: true }
    };

    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: evento
    });

    console.log(`✅ Evento adicionado ao Google Calendar: ${result.data.id}`);
    return result.data;
  } catch (erro) {
    console.error('⚠️ Erro ao adicionar ao Google Calendar:', erro.message);
    return null;
  }
}

// ===== ROTAS =====

// GET - Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST - Criar agendamento
app.post('/api/agendamentos', async (req, res) => {
  const ipOrigem = req.ip || req.connection.remoteAddress;
  const timestamp = new Date().toLocaleString('pt-BR');
  
  try {
    const { nome, email, whatsapp, servico, data, hora, mensagem } = req.body;

    // LOG DE REQUISIÇÃO
    console.log(`\n📝 [${timestamp}] Nova requisição de agendamento`);
    console.log(`   IP: ${ipOrigem}`);
    console.log(`   Nome: ${nome}, Email: ${email}, WhatsApp: ${whatsapp}`);

    // ===== VALIDAÇÕES =====
    const erros = [];

    // Validar Nome
    if (!nome || !validarNome(nome)) {
      erros.push('Nome inválido (mín. 3 caracteres)');
    }

    // Validar Email
    if (!email || !validarEmail(email)) {
      erros.push('Email inválido (ex: seu@email.com)');
    }

    // Validar WhatsApp
    if (!whatsapp || !validarTelefone(whatsapp)) {
      erros.push('WhatsApp inválido (10-11 dígitos)');
    }

    // Validar Serviço
    if (!servico || !validarServico(servico)) {
      erros.push('Serviço inválido');
    }

    // Validar Data e Hora
    if (!data || !hora) {
      erros.push('Data e hora obrigatórias');
    } else {
      const dataSelecionada = new Date(data.replace('T', ' '));
      if (isNaN(dataSelecionada.getTime()) || dataSelecionada <= new Date()) {
        erros.push('Data/hora deve ser futura e válida');
      }
    }

    // Se houver erros, retornar
    if (erros.length > 0) {
      console.warn(`❌ Validação falhou: ${erros.join('; ')}`);
      return res.status(400).json({
        sucesso: false,
        mensagem: erros[0] || 'Dados inválidos'
      });
    }

    // Sanitizar dados
    const nomeLimpo = sanitizarTexto(nome);
    const emailLimpo = email.trim().toLowerCase();
    const telefoneLimpo = whatsapp.replace(/\D/g, '');
    const mensagemLimpa = mensagem ? sanitizarTexto(mensagem) : '';

    // ===== SALVAR NO BANCO =====
    const sql = `
      INSERT INTO agendamentos (nome, email, whatsapp, servico, data, hora, mensagem)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nomeLimpo, emailLimpo, telefoneLimpo, servico, data, hora, mensagemLimpa], async function(err) {
      if (err) {
        console.error(`❌ Erro ao salvar no banco: ${err.message}`);
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro ao salvar agendamento. Tente novamente.'
        });
      }

      const idAgendamento = this.lastID;
      console.log(`✅ Agendamento #${idAgendamento} salvo no banco`);

      // ===== TENTAR ADICIONAR AO GOOGLE CALENDAR =====
      const eventoAdicionado = await adicionarAoCalendarioAutomatico(nomeLimpo, servico, data, hora, emailLimpo);

      // ===== RESPOSTA SUCESSO =====
      res.status(201).json({
        sucesso: true,
        id: idAgendamento,
        mensagem: eventoAdicionado 
          ? '✅ Agendamento realizado e adicionado ao calendário!'
          : '✅ Agendamento realizado!',
        eventoId: eventoAdicionado?.id || null
      });

      console.log(`✅ Resposta enviada para cliente: agendamento #${idAgendamento}`);
    });

  } catch (erro) {
    console.error(`❌ [${timestamp}] Erro geral na rota POST: ${erro.message}`);
    console.error(erro.stack);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// GET - Listar todos os agendamentos
app.get('/api/agendamentos', (req, res) => {
  console.log(`\n📋 [${new Date().toLocaleString('pt-BR')}] Requisição GET /api/agendamentos`);
  
  db.all(
    `SELECT id, nome, servico, data, hora, data_criacao FROM agendamentos ORDER BY data_criacao DESC LIMIT 100`,
    (err, rows) => {
      if (err) {
        console.error(`❌ Erro ao buscar agendamentos: ${err.message}`);
        return res.status(500).json({
          sucesso: false,
          mensagem: 'Erro ao buscar dados'
        });
      }

      console.log(`✅ Retornados ${rows?.length || 0} agendamentos`);
      res.json(rows || []);
    }
  );
});

// DELETE - Remover agendamento (proteção importante!) - apenas para admin
app.delete('/api/agendamentos/:id', (req, res) => {
  const adminToken = req.headers['x-admin-token'];
  const expectedToken = process.env.ADMIN_TOKEN || 'admin-token-seguro';

  if (adminToken !== expectedToken) {
    console.warn(`❌ Tentativa de DELETE sem token válido do IP ${req.ip}`);
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Acesso negado'
    });
  }

  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido'
    });
  }

  db.run(`DELETE FROM agendamentos WHERE id = ?`, [id], function(err) {
    if (err) {
      console.error(`❌ Erro ao deletar: ${err.message}`);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao deletar'
      });
    }

    console.log(`✅ Agendamento #${id} deletado`);
    res.json({ sucesso: true, mensagem: 'Agendamento removido' });
  });
});

// ===== ERROR HANDLING =====
app.use((req, res) => {
  console.warn(`❌ [${new Date().toLocaleString('pt-BR')}] Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVIDOR INICIADO COM SUCESSO');
  console.log('='.repeat(50));
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`🔒 Rate Limit: ${RATE_LIMIT} requisições por hora/IP`);
  console.log(`💾 Database: ${dbPath}`);
  console.log('='.repeat(50) + '\n');
});

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGINT', () => {
  console.log('\n📴 Encerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('❌ Erro ao fechar banco:', err.message);
    }
    console.log('✅ Banco de dados fechado');
    process.exit(0);
  });
});

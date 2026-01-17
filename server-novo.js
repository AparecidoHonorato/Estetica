const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { google } = require('googleapis');
const fs = require('fs');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Conectar ao banco de dados
const dbPath = path.join(__dirname, 'database', 'agendamentos.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('✓ Banco de dados conectado');
        // Criar tabela se não existir
        db.run(`
            CREATE TABLE IF NOT EXISTS agendamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                whatsapp TEXT NOT NULL,
                servico TEXT NOT NULL,
                data TEXT NOT NULL,
                hora TEXT NOT NULL,
                mensagem TEXT,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

// Configurar Google Calendar
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
        console.log('✓ Google Calendar API configurado');
    } else {
        console.log('⚠️ Arquivo credentials.json não encontrado. Usando fallback.');
    }
} catch (erro) {
    console.log('⚠️ Erro ao configurar Google Calendar:', erro.message);
}

// Função para adicionar evento ao Google Calendar automaticamente
async function adicionarAoCalendarioAutomatico(nome, servico, data, hora, whatsapp, mensagem) {
    if (!calendar) {
        console.log('Google Calendar não configurado. Usando fallback.');
        return null;
    }

    try {
        // Combinar data e hora
        const [ano, mes, dia] = data.split('-');
        const dataObj = new Date(ano, mes - 1, dia);
        
        // Parse hora
        const [horas, minutos] = hora.split(':');
        const startTime = new Date(dataObj);
        startTime.setHours(parseInt(horas), parseInt(minutos));
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);

        const evento = {
            summary: `Agendamento: ${nome} - ${servico}`,
            description: `Nome: ${nome}\nWhatsApp: ${whatsapp}\nServiço: ${servico}\nMensagem: ${mensagem || 'Sem mensagem adicional'}`,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'America/Sao_Paulo'
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'America/Sao_Paulo'
            },
            attendees: [
                { email: 'aparecidogomes1003@gmail.com' }
            ],
            reminders: {
                useDefault: true
            }
        };

        const result = await calendar.events.insert({
            calendarId: 'primary',
            resource: evento
        });

        console.log('✓ Evento adicionado ao Google Calendar:', result.data.id);
        return result.data;
    } catch (erro) {
        console.error('Erro ao adicionar evento:', erro.message);
        return null;
    }
}

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota POST para salvar agendamento
app.post('/api/agendamentos', async (req, res) => {
    try {
        const { nome, whatsapp, servico, data, hora, mensagem } = req.body;

        console.log('Dados recebidos:', { nome, whatsapp, servico, data, hora, mensagem });

        // Validar dados
        if (!nome || !whatsapp || !servico || !data || !hora) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: 'Dados incompletos' 
            });
        }

        // Inserir no banco de dados
        const sql = `INSERT INTO agendamentos (nome, whatsapp, servico, data, hora, mensagem) VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.run(sql, [nome, whatsapp, servico, data, hora, mensagem || ''], async function(err) {
            if (err) {
                console.error('Erro ao salvar:', err);
                return res.status(500).json({ 
                    sucesso: false, 
                    mensagem: 'Erro ao salvar agendamento'
                });
            }

            console.log('Agendamento salvo com ID:', this.lastID);

            // Tentar adicionar ao Google Calendar automaticamente
            const eventoAdicionado = await adicionarAoCalendarioAutomatico(nome, servico, data, hora, whatsapp, mensagem);

            if (eventoAdicionado) {
                res.json({ 
                    sucesso: true, 
                    mensagem: '✓ Agendamento salvo e adicionado ao calendário automaticamente!',
                    id: this.lastID,
                    eventoId: eventoAdicionado.id
                });
            } else {
                res.json({ 
                    sucesso: true, 
                    mensagem: '✓ Agendamento salvo! (Calendário em modo manual)',
                    id: this.lastID
                });
            }
        });
    } catch (erro) {
        console.error('Erro na rota POST:', erro);
        res.status(500).json({ 
            sucesso: false, 
            mensagem: 'Erro interno do servidor'
        });
    }
});

// Rota GET para listar agendamentos
app.get('/api/agendamentos', (req, res) => {
    db.all(`SELECT * FROM agendamentos ORDER BY data_criacao DESC`, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar:', err);
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

// Porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
    console.log(`✓ Abra http://localhost:${PORT} no navegador`);
});


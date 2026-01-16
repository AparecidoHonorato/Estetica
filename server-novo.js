const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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

// Função para gerar URL do Google Calendar
function generateGoogleCalendarUrl(nome, servico, data, hora, whatsapp, mensagem) {
    try {
        // Combinar data e hora
        const [ano, mes, dia] = data.split('-');
        const [horas, minutos] = hora.split(':');
        
        const dataObj = new Date(ano, mes - 1, dia, horas, minutos);
        const startTime = dataObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endTime = new Date(dataObj.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        const titulo = `Agendamento: ${nome} - ${servico}`;
        const descricao = `Nome: ${nome}%0AWhatsApp: ${whatsapp}%0AServiço: ${servico}%0AHorário: ${hora}%0AMensagem: ${mensagem || 'Sem mensagem'}`;
        
        const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(titulo)}&dates=${startTime}/${endTime}&details=${descricao}&location=Lumena%20Estética`;
        
        return url;
    } catch (erro) {
        console.error('Erro ao gerar URL do calendário:', erro);
        return null;
    }
}

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota POST para salvar agendamento
app.post('/api/agendamentos', (req, res) => {
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
        
        db.run(sql, [nome, whatsapp, servico, data, hora, mensagem || ''], function(err) {
            if (err) {
                console.error('Erro ao salvar:', err);
                return res.status(500).json({ 
                    sucesso: false, 
                    mensagem: 'Erro ao salvar agendamento'
                });
            }

            // Gerar URL do Google Calendar
            const calendarUrl = generateGoogleCalendarUrl(nome, servico, data, hora, whatsapp, mensagem);

            console.log('Agendamento salvo com ID:', this.lastID);

            res.json({ 
                sucesso: true, 
                mensagem: 'Agendamento salvo com sucesso!',
                id: this.lastID,
                calendarUrl: calendarUrl
            });
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

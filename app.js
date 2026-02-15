const express = require('express');
const path = require('path');
const db = require('./database/db');
const { googleCalendarEmail } = require('./calendar-config');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Função para gerar URL do Google Calendar
function generateGoogleCalendarUrl(nome, servico, data, whatsapp, email, mensagem) {
    const dataObj = new Date(data);
    const startTime = dataObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = new Date(dataObj.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const titulo = `Agendamento: ${nome} - ${servico}`;
    const descricao = `Nome: ${nome}%0AEmail: ${email}%0AWhatsApp: ${whatsapp}%0AServiço: ${servico}%0AMensagem: ${mensagem || 'Sem mensagem'}`;
    
    const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(titulo)}&dates=${startTime}/${endTime}&details=${descricao}&location=Lumena%20Estética`;
    
    return url;
}

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota POST para salvar agendamento e adicionar ao calendário
app.post('/api/agendamentos', (req, res) => {
    const { nome, email, whatsapp, servico, data, mensagem } = req.body;

    // Validar dados
    if (!nome || !email || !whatsapp || !servico || !data) {
        return res.status(400).json({ 
            sucesso: false, 
            mensagem: 'Dados incompletos' 
        });
    }

    // Inserir no banco de dados
    const sql = `INSERT INTO agendamentos (nome, email, whatsapp, servico, data, mensagem) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [nome, email, whatsapp, servico, data, mensagem || ''], function(err) {
        if (err) {
            console.error('Erro ao salvar agendamento:', err);
            return res.status(500).json({ 
                sucesso: false, 
                mensagem: 'Erro ao salvar agendamento'
            });
        }

        // Gerar URL do Google Calendar
        const calendarUrl = generateGoogleCalendarUrl(nome, servico, data, whatsapp, email, mensagem);

        res.json({ 
            sucesso: true, 
            mensagem: 'Agendamento salvo com sucesso!',
            id: this.lastID,
            calendarUrl: calendarUrl
        });
    });
});

// Rota GET para listar agendamentos
app.get('/api/agendamentos', (req, res) => {
    db.all(`SELECT * FROM agendamentos ORDER BY data_criacao DESC`, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar agendamentos:', err);
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

// Porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
});

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'agendamentos.db');

// Criar conexão
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('✓ Banco de dados conectado');
        inicializarBanco();
    }
});

// Criar tabela se não existir
function inicializarBanco() {
    db.run(`
        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            servico TEXT NOT NULL,
            data TEXT NOT NULL,
            mensagem TEXT,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

module.exports = db;
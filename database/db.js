import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'agendamentos.db');

// Criar conexão
const db = new (sqlite3.verbose()).Database(dbPath, (err) => {
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
            email TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            servico TEXT NOT NULL,
            data TEXT NOT NULL,
            hora TEXT,
            mensagem TEXT,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Adicionar coluna email se não existir (para bancos existentes)
    db.run(`ALTER TABLE agendamentos ADD COLUMN email TEXT`, (err) => {
        if (!err || err.message.includes('duplicate column')) {
            // Coluna já existe ou foi adicionada com sucesso
        }
    });
}

export default db;
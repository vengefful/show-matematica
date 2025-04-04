const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados SQLite');
});

// Criar tabela de configurações
db.run(`
    CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numQuestoes INTEGER DEFAULT 20,
        tempoPorQuestao INTEGER DEFAULT 180,
        pontuacaoMaxima INTEGER DEFAULT 20,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela de configurações:', err.message);
        process.exit(1);
    }
    console.log('Tabela de configurações criada com sucesso');

    // Inserir configuração padrão se não existir
    db.get('SELECT COUNT(*) as count FROM configuracoes', [], (err, row) => {
        if (err) {
            console.error('Erro ao verificar configurações:', err.message);
            process.exit(1);
        }

        if (row.count === 0) {
            db.run(`
                INSERT INTO configuracoes (numQuestoes, tempoPorQuestao, pontuacaoMaxima)
                VALUES (20, 180, 20)
            `, (err) => {
                if (err) {
                    console.error('Erro ao inserir configuração padrão:', err.message);
                    process.exit(1);
                }
                console.log('Configuração padrão inserida com sucesso');
                db.close();
            });
        } else {
            console.log('Configuração já existe');
            db.close();
        }
    });
}); 
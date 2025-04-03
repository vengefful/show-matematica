const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');
const db = new sqlite3.Database(dbPath);

console.log('Verificando banco de dados...');

// Verificar estrutura da tabela perguntas
db.all("PRAGMA table_info(perguntas)", [], (err, columns) => {
    if (err) {
        console.error('Erro ao verificar estrutura da tabela:', err);
        return;
    }
    
    console.log('\nEstrutura da tabela perguntas:');
    columns.forEach(col => {
        console.log(`${col.name} (${col.type})`);
    });
    
    // Verificar conteúdo da tabela perguntas
    db.all("SELECT * FROM perguntas", [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar perguntas:', err);
            return;
        }
        
        console.log('\nPerguntas encontradas:', rows.length);
        rows.forEach(row => {
            console.log('\nID:', row.id);
            console.log('Pergunta:', row.pergunta);
            console.log('Disciplina:', row.disciplina);
            console.log('Turma:', row.turma);
            console.log('Alternativas:', {
                a1: row.alternativa1,
                a2: row.alternativa2,
                a3: row.alternativa3,
                a4: row.alternativa4
            });
            console.log('Resposta:', row.resposta);
        });
    });
});

db.close(); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');
const dbPathR = path.join(__dirname, 'rank', 'rank.db');

const db = new sqlite3.Database(dbPath);
const dbR = new sqlite3.Database(dbPathR);

console.log('Iniciando migração...');

// Backup dos dados existentes
db.all("SELECT * FROM perguntas", [], (err, rows) => {
    if (err) {
        console.error('Erro ao fazer backup:', err);
        return;
    }
    
    const backup = rows;
    
    // Recriar a tabela com a estrutura correta
    db.serialize(() => {
        // Dropar a tabela antiga
        db.run("DROP TABLE IF EXISTS perguntas", (err) => {
            if (err) {
                console.error('Erro ao dropar tabela:', err);
                return;
            }
            
            // Criar nova tabela com estrutura correta
            db.run(`CREATE TABLE perguntas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pergunta TEXT NOT NULL,
                alternativa1 TEXT NOT NULL,
                alternativa2 TEXT NOT NULL,
                alternativa3 TEXT NOT NULL,
                alternativa4 TEXT NOT NULL,
                resposta INTEGER NOT NULL,
                disciplina TEXT NOT NULL,
                turma TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela:', err);
                    return;
                }
                
                // Reinserir os dados do backup
                const stmt = db.prepare(`INSERT INTO perguntas 
                    (id, pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                
                backup.forEach(row => {
                    stmt.run(
                        row.id,
                        row.pergunta,
                        row.alternativa1,
                        row.alternativa2,
                        row.alternativa3,
                        row.alternativa4,
                        row.resposta,
                        row.disciplina || 'Matemática',
                        row.turma || 'EMMAT1A'
                    );
                });
                
                stmt.finalize();
                
                console.log('Migração concluída!');
                
                // Adicionar perguntas de exemplo se necessário
                db.get("SELECT COUNT(*) as count FROM perguntas", [], (err, row) => {
                    if (err || row.count === 0) {
                        const exemplos = [
                            {
                                pergunta: "Qual é o resultado de 2 + 2?",
                                alternativa1: "3",
                                alternativa2: "4",
                                alternativa3: "5",
                                alternativa4: "6",
                                resposta: 2,
                                disciplina: "Matemática",
                                turma: "EMMAT1A"
                            },
                            {
                                pergunta: "Qual é a raiz quadrada de 16?",
                                alternativa1: "2",
                                alternativa2: "3",
                                alternativa3: "4",
                                alternativa4: "5",
                                resposta: 3,
                                disciplina: "Matemática",
                                turma: "EMMAT1A"
                            },
                            {
                                pergunta: "Qual é o resultado de 10 ÷ 2?",
                                alternativa1: "3",
                                alternativa2: "5",
                                alternativa3: "7",
                                alternativa4: "9",
                                resposta: 2,
                                disciplina: "Matemática",
                                turma: "EMMAT1A"
                            },
                            {
                                pergunta: "Quanto é 3²?",
                                alternativa1: "6",
                                alternativa2: "9",
                                alternativa3: "12",
                                alternativa4: "15",
                                resposta: 2,
                                disciplina: "Matemática",
                                turma: "EMMAT1A"
                            }
                        ];
                        
                        const stmt = db.prepare(`INSERT INTO perguntas 
                            (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
                        
                        exemplos.forEach(ex => {
                            stmt.run(
                                ex.pergunta,
                                ex.alternativa1,
                                ex.alternativa2,
                                ex.alternativa3,
                                ex.alternativa4,
                                ex.resposta,
                                ex.disciplina,
                                ex.turma
                            );
                        });
                        
                        stmt.finalize();
                        console.log('Perguntas de exemplo adicionadas!');
                    }
                });
            });
        });
    });
});

// Criar tabela de turmas se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS pergunta_turmas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pergunta_id INTEGER,
        turma TEXT,
        FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
    )
`);

// Criar tabela de ranks
dbR.run(`CREATE TABLE IF NOT EXISTS ranks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    nota FLOAT,
    data TEXT,
    escola TEXT,
    disciplina TEXT,
    turma TEXT
)`);

// Migrar dados existentes
db.all('SELECT id, disciplina FROM perguntas', [], (err, rows) => {
    if (err) {
        console.error('Erro ao buscar perguntas:', err);
        return;
    }

    rows.forEach(row => {
        const turma = 'EMMAT1A'; // Turma padrão para migração
        db.run('INSERT INTO pergunta_turmas (pergunta_id, turma) VALUES (?, ?)', [row.id, turma], (err) => {
            if (err) {
                console.error('Erro ao inserir turma:', err);
            }
        });
    });
});

console.log('Banco de dados criado e perguntas de exemplo adicionadas!');

// Fechar conexões
db.close();
dbR.close(); 
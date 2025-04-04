const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');
const dbPathR = path.join(__dirname, 'rank', 'rank.db');

// Remover arquivos antigos se existirem
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}
if (fs.existsSync(dbPathR)) {
    fs.unlinkSync(dbPathR);
}

const db = new sqlite3.Database(dbPath);
const dbR = new sqlite3.Database(dbPathR);

console.log('Iniciando reset do banco de dados...');

// Criar tabela de perguntas
db.serialize(() => {
    // Criar tabela de perguntas
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
            console.error('Erro ao criar tabela perguntas:', err);
            return;
        }
        console.log('Tabela perguntas criada com sucesso!');
        
        // Criar tabela de turmas
        db.run(`CREATE TABLE pergunta_turmas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pergunta_id INTEGER,
            turma TEXT,
            FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela pergunta_turmas:', err);
                return;
            }
            console.log('Tabela pergunta_turmas criada com sucesso!');
            
            // Inserir questões de teste
            const questoes = [
                {
                    pergunta: "Qual é o resultado de 2 + 2?",
                    alternativa1: "3",
                    alternativa2: "4",
                    alternativa3: "5",
                    alternativa4: "6",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é a raiz quadrada de 16?",
                    alternativa1: "2",
                    alternativa2: "3",
                    alternativa3: "4",
                    alternativa4: "5",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 10 ÷ 2?",
                    alternativa1: "3",
                    alternativa2: "5",
                    alternativa3: "7",
                    alternativa4: "9",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 3²?",
                    alternativa1: "6",
                    alternativa2: "9",
                    alternativa3: "12",
                    alternativa4: "15",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 5 × 7?",
                    alternativa1: "30",
                    alternativa2: "35",
                    alternativa3: "40",
                    alternativa4: "45",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 15 - 8?",
                    alternativa1: "5",
                    alternativa2: "6",
                    alternativa3: "7",
                    alternativa4: "8",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 4 × 6?",
                    alternativa1: "18",
                    alternativa2: "24",
                    alternativa3: "28",
                    alternativa4: "30",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é a raiz quadrada de 25?",
                    alternativa1: "4",
                    alternativa2: "5",
                    alternativa3: "6",
                    alternativa4: "7",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 20 ÷ 4?",
                    alternativa1: "4",
                    alternativa2: "5",
                    alternativa3: "6",
                    alternativa4: "7",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 8 + 9?",
                    alternativa1: "15",
                    alternativa2: "16",
                    alternativa3: "17",
                    alternativa4: "18",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 4²?",
                    alternativa1: "8",
                    alternativa2: "12",
                    alternativa3: "16",
                    alternativa4: "20",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 12 × 3?",
                    alternativa1: "24",
                    alternativa2: "36",
                    alternativa3: "48",
                    alternativa4: "60",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 30 ÷ 6?",
                    alternativa1: "3",
                    alternativa2: "4",
                    alternativa3: "5",
                    alternativa4: "6",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 7 + 15?",
                    alternativa1: "20",
                    alternativa2: "21",
                    alternativa3: "22",
                    alternativa4: "23",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 5²?",
                    alternativa1: "20",
                    alternativa2: "25",
                    alternativa3: "30",
                    alternativa4: "35",
                    resposta: 2,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é a raiz quadrada de 36?",
                    alternativa1: "4",
                    alternativa2: "5",
                    alternativa3: "6",
                    alternativa4: "7",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 18 - 9?",
                    alternativa1: "7",
                    alternativa2: "8",
                    alternativa3: "9",
                    alternativa4: "10",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 8 × 4?",
                    alternativa1: "24",
                    alternativa2: "28",
                    alternativa3: "32",
                    alternativa4: "36",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Quanto é 40 ÷ 8?",
                    alternativa1: "3",
                    alternativa2: "4",
                    alternativa3: "5",
                    alternativa4: "6",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                },
                {
                    pergunta: "Qual é o resultado de 13 + 7?",
                    alternativa1: "18",
                    alternativa2: "19",
                    alternativa3: "20",
                    alternativa4: "21",
                    resposta: 3,
                    disciplina: "Matematica",
                    turma: "EMMAT1A"
                }
            ];
            
            const stmt = db.prepare(`INSERT INTO perguntas 
                (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            
            questoes.forEach(q => {
                stmt.run(
                    q.pergunta,
                    q.alternativa1,
                    q.alternativa2,
                    q.alternativa3,
                    q.alternativa4,
                    q.resposta,
                    q.disciplina,
                    q.turma,
                    function(err) {
                        if (err) {
                            console.error('Erro ao inserir pergunta:', err);
                            return;
                        }
                        
                        // Inserir na tabela pergunta_turmas usando o ID da pergunta que acabou de ser inserida
                        const perguntaId = this.lastID;
                        const stmtTurma = db.prepare('INSERT INTO pergunta_turmas (pergunta_id, turma) VALUES (?, ?)');
                        stmtTurma.run(perguntaId, q.turma);
                        stmtTurma.finalize();
                    }
                );
            });
            
            stmt.finalize();
            console.log('Questões de teste inseridas com sucesso!');
            
            // Criar tabela de ranks
            dbR.run(`CREATE TABLE ranks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                nota INTEGER NOT NULL,
                turma TEXT NOT NULL,
                disciplina TEXT NOT NULL,
                data_hora DATETIME DEFAULT (datetime('now', 'localtime'))
            )`, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela ranks:', err);
                    return;
                }
                console.log('Tabela ranks criada com sucesso!');
                
                // Fechar conexões
                db.close();
                dbR.close();
                console.log('Reset do banco de dados concluído!');
            });
        });
    });
}); 
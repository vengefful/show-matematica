const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');
const dbPathR = path.join(__dirname, 'rank', 'rank.db');
const csvPath = path.join(__dirname, 'questoes', 'questions.csv');

const db = new sqlite3.Database(dbPath);
const dbR = new sqlite3.Database(dbPathR);

console.log('Iniciando restauração do banco de dados...');

// Criar tabela de perguntas
db.serialize(() => {
    // Dropar tabela se existir
    db.run("DROP TABLE IF EXISTS perguntas");
    db.run("DROP TABLE IF EXISTS pergunta_turmas");
    
    // Criar nova tabela
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
            
            // Ler arquivo CSV e inserir dados
            const perguntas = [];
            fs.createReadStream(csvPath)
                .pipe(csv({ separator: ';' }))
                .on('data', (row) => {
                    const respostas = [
                        { texto: row.q1, correta: row.r1 === 'TRUE' },
                        { texto: row.q2, correta: row.r2 === 'TRUE' },
                        { texto: row.q3, correta: row.r3 === 'TRUE' },
                        { texto: row.q4, correta: row.r4 === 'TRUE' }
                    ];
                    
                    const respostaCorreta = respostas.findIndex(r => r.correta) + 1;
                    
                    perguntas.push({
                        pergunta: row.question,
                        alternativa1: respostas[0].texto,
                        alternativa2: respostas[1].texto,
                        alternativa3: respostas[2].texto,
                        alternativa4: respostas[3].texto,
                        resposta: respostaCorreta,
                        disciplina: 'Matemática',
                        turma: 'EMMAT1A'
                    });
                })
                .on('end', () => {
                    console.log(`Lidas ${perguntas.length} perguntas do CSV`);
                    
                    const stmt = db.prepare(`INSERT INTO perguntas 
                        (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
                    
                    perguntas.forEach(p => {
                        stmt.run(
                            p.pergunta,
                            p.alternativa1,
                            p.alternativa2,
                            p.alternativa3,
                            p.alternativa4,
                            p.resposta,
                            p.disciplina,
                            p.turma
                        );
                    });
                    
                    stmt.finalize();
                    console.log('Perguntas inseridas com sucesso!');
                    
                    // Inserir turmas na tabela pergunta_turmas
                    db.all('SELECT id, turma FROM perguntas', [], (err, rows) => {
                        if (err) {
                            console.error('Erro ao buscar perguntas:', err);
                            return;
                        }
                        
                        const stmt = db.prepare('INSERT INTO pergunta_turmas (pergunta_id, turma) VALUES (?, ?)');
                        rows.forEach(row => {
                            stmt.run(row.id, row.turma);
                        });
                        stmt.finalize();
                        console.log('Turmas inseridas com sucesso!');
                        
                        // Criar tabela de ranks
                        dbR.run(`CREATE TABLE IF NOT EXISTS ranks (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            nome TEXT,
                            nota FLOAT,
                            data TEXT,
                            escola TEXT,
                            disciplina TEXT,
                            turma TEXT
                        )`, (err) => {
                            if (err) {
                                console.error('Erro ao criar tabela ranks:', err);
                                return;
                            }
                            console.log('Tabela ranks criada com sucesso!');
                            
                            // Fechar conexões
                            db.close();
                            dbR.close();
                            console.log('Restauração concluída!');
                        });
                    });
                });
        });
    });
}); 
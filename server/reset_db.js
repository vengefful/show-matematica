const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');

// Criar novo banco
const db = new sqlite3.Database(dbPath);

console.log('Criando novo banco de dados...');

// Criar tabela de perguntas
db.serialize(() => {
    // Dropar tabela se existir
    db.run("DROP TABLE IF EXISTS perguntas", (err) => {
        if (err) {
            console.error('Erro ao dropar tabela:', err);
            return;
        }
        console.log('Tabela antiga removida.');
    });

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
            console.error('Erro ao criar tabela:', err);
            return;
        }
        console.log('Nova tabela criada.');
    });

    // Inserir perguntas de exemplo
    const stmt = db.prepare(`
        INSERT INTO perguntas (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const perguntas = [
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

    perguntas.forEach(p => {
        stmt.run(
            p.pergunta,
            p.alternativa1,
            p.alternativa2,
            p.alternativa3,
            p.alternativa4,
            p.resposta,
            p.disciplina,
            p.turma,
            (err) => {
                if (err) {
                    console.error('Erro ao inserir pergunta:', err);
                }
            }
        );
    });

    stmt.finalize();

    // Verificar se as perguntas foram inseridas
    db.all("SELECT * FROM perguntas", [], (err, rows) => {
        if (err) {
            console.error('Erro ao verificar perguntas:', err);
            return;
        }
        console.log(`\nForam inseridas ${rows.length} perguntas:`);
        rows.forEach(row => {
            console.log(`\nID: ${row.id}`);
            console.log(`Pergunta: ${row.pergunta}`);
            console.log(`Disciplina: ${row.disciplina}`);
            console.log(`Turma: ${row.turma}`);
            console.log(`Alternativas:`, {
                a1: row.alternativa1,
                a2: row.alternativa2,
                a3: row.alternativa3,
                a4: row.alternativa4
            });
            console.log(`Resposta: ${row.resposta}`);
        });

        // Fechar conexão
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar banco:', err);
                return;
            }
            console.log('\nBanco de dados recriado com sucesso!');
        });
    });
}); 
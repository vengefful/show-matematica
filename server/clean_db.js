const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');

// Deletar o banco de dados existente
try {
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('Banco de dados antigo deletado com sucesso');
    }
} catch (err) {
    console.error('Erro ao deletar banco de dados:', err);
}

// Criar novo banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao criar banco de dados:', err);
        return;
    }
    console.log('Novo banco de dados criado com sucesso');
});

// Criar tabela de perguntas
db.run(`CREATE TABLE IF NOT EXISTS perguntas (
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
    console.log('Tabela perguntas criada com sucesso');

    // Inserir perguntas de exemplo
    const perguntas = [
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
            pergunta: "Qual é o resultado de 5 x 5?",
            alternativa1: "20",
            alternativa2: "25",
            alternativa3: "30",
            alternativa4: "35",
            resposta: 2,
            disciplina: "Matematica",
            turma: "EMMAT1A"
        },
        {
            pergunta: "Qual é o resultado de 10 ÷ 2?",
            alternativa1: "3",
            alternativa2: "4",
            alternativa3: "5",
            alternativa4: "6",
            resposta: 3,
            disciplina: "Matematica",
            turma: "EMMAT1A"
        },
        {
            pergunta: "Qual é o resultado de 3²?",
            alternativa1: "6",
            alternativa2: "9",
            alternativa3: "12",
            alternativa4: "15",
            resposta: 2,
            disciplina: "Matematica",
            turma: "EMMAT1A"
        }
    ];

    const stmt = db.prepare(`INSERT INTO perguntas (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    perguntas.forEach(pergunta => {
        stmt.run(
            pergunta.pergunta,
            pergunta.alternativa1,
            pergunta.alternativa2,
            pergunta.alternativa3,
            pergunta.alternativa4,
            pergunta.resposta,
            pergunta.disciplina,
            pergunta.turma
        );
    });

    stmt.finalize();
    console.log('Perguntas de exemplo adicionadas com sucesso');
});

// Fechar conexão com o banco de dados
db.close((err) => {
    if (err) {
        console.error('Erro ao fechar banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados fechada');
}); 
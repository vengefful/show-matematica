const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'questoes', 'questions.db');
const db = new sqlite3.Database(dbPath);

console.log('Verificando banco de dados...');

// Primeiro, vamos limpar a tabela para evitar duplicatas
db.run('DELETE FROM perguntas', function(err) {
    if (err) {
        console.error('Erro ao limpar tabela:', err);
        return;
    }
    console.log('Tabela limpa com sucesso!');

    // Agora vamos adicionar as perguntas
    const perguntasExemplo = [
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
            pergunta: "Quanto é 5 x 5?",
            alternativa1: "20",
            alternativa2: "25",
            alternativa3: "30",
            alternativa4: "35",
            resposta: 2,
            disciplina: "Matemática",
            turma: "EMMAT1A"
        },
        {
            pergunta: "Qual é o resultado de 10 ÷ 2?",
            alternativa1: "3",
            alternativa2: "4",
            alternativa3: "5",
            alternativa4: "6",
            resposta: 3,
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

    let perguntasAdicionadas = 0;
    perguntasExemplo.forEach(pergunta => {
        db.run(`INSERT INTO perguntas (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [pergunta.pergunta, pergunta.alternativa1, pergunta.alternativa2, pergunta.alternativa3, pergunta.alternativa4, 
             pergunta.resposta, pergunta.disciplina, pergunta.turma],
            function(err) {
                if (err) {
                    console.error('Erro ao adicionar pergunta:', err);
                } else {
                    perguntasAdicionadas++;
                    console.log(`Pergunta adicionada com ID: ${this.lastID}`);
                    
                    // Se for a última pergunta, mostrar o total
                    if (perguntasAdicionadas === perguntasExemplo.length) {
                        console.log(`\nTotal de perguntas adicionadas: ${perguntasAdicionadas}`);
                        
                        // Verificar todas as perguntas no banco
                        db.all('SELECT * FROM perguntas', [], (err, rows) => {
                            if (err) {
                                console.error('Erro ao verificar perguntas:', err);
                                return;
                            }
                            
                            console.log('\nPerguntas no banco:');
                            rows.forEach(row => {
                                console.log(`ID: ${row.id}`);
                                console.log(`Pergunta: ${row.pergunta}`);
                                console.log(`Disciplina: ${row.disciplina}`);
                                console.log(`Turma: ${row.turma}`);
                                console.log('---');
                            });
                        });
                    }
                }
            }
        );
    });
});

// Verificar dados na tabela pergunta_turmas
db.all('SELECT * FROM pergunta_turmas LIMIT 5', [], (err, rows) => {
    if (err) {
        console.error('Erro ao buscar pergunta_turmas:', err);
        return;
    }
    console.log('\nPrimeiras 5 pergunta_turmas:');
    console.log(rows);
});

// Verificar contagem de perguntas por turma
db.all(`
    SELECT pt.turma, COUNT(*) as total
    FROM pergunta_turmas pt
    GROUP BY pt.turma
`, [], (err, rows) => {
    if (err) {
        console.error('Erro ao contar perguntas por turma:', err);
        return;
    }
    console.log('\nContagem de perguntas por turma:');
    console.log(rows);
});

db.close(); 
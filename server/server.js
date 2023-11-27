const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const sqlite3 = require("sqlite3").verbose();

const app = express();
const dbPath = path.join(__dirname, 'questoes', 'questions.db');

// folder static
app.use(express.static(path.join(__dirname, 'questoes')));
app.use(express.static(path.join(__dirname, 'rank')));
app.use(express.json());

//Habilitar o CORS para todas as requisições
app.use(cors());

//criando conexao com o banco de dados sqlite
const db = new sqlite3.Database(dbPath, (err) => {
    if(err) {
        console.error(err.message);
        throw err;
    } else{
        console.log(`Conectado ao banco de dados SQLite: ${dbPath}`);
        createTable();
    }
});

// Fechar a conexão com o banco de dados (geralmente feito ao encerrar a aplicação)
process.on('SIGINT', () => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Conexão com o banco de dados fechada.');
      process.exit();
    });
  });  

// função verificar se a pergunta no servidor já existe
function verificarPerguntaExistente(textoPergunta) {
    return new Promise((resolve, reject) => {
  
      db.get('SELECT COUNT(*) AS count FROM perguntas WHERE pergunta = ?', [textoPergunta], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
  
        if (row.count > 0) {
          resolve(true); // Pergunta já existe no banco de dados
        } else {
          resolve(false); // Pergunta não existe no banco de dados
        }
      });
  
    });
}

// Função para adicionar uma nova pergunta somente se for uma pergunta nova
async function adicionarPerguntaSeNova(pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma) {
    const perguntaExiste = await verificarPerguntaExistente(pergunta);
    
    if (!perguntaExiste) {
  
      const stmt = db.prepare('INSERT INTO perguntas (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run(pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma, function(err) {
        if (err) {
          console.error('Erro ao adicionar pergunta:', err);
          return;
        }
        
        console.log('Pergunta adicionada com sucesso.');
      });
  
      stmt.finalize();
    } else {
      console.log('Pergunta já existe no banco de dados.');
    }
}

//funcao criar tabela se ainda nao existir
function createTable(){
    db.run(`CREATE TABLE IF NOT EXISTS perguntas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pergunta TEXT,
        alternativa1 TEXT,
        alternativa2 TEXT,
        alternativa3 TEXT,
        alternativa4 TEXT,
        resposta INTEGER,
        disciplina,
        turma
    )`, (err) => {
        if(err){
            console.log('Erro ao criar a tabela: ', err.message);
        } else{
            console.log('Tabela perguntas criadas no banco de dados');
        }
    });
}

//rota para obter uma pergunta aleatoria do banco de dados
app.get('/api/pergunta', (req, res) => {

    const disciplina = req.query.disciplina;
    const turma = req.query.turma;

    /*db.get('SELECT * FROM perguntas ORDER BY RANDOM() LIMIT 1', (err, row) => {
        if(err){
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });*/

    query = `SELECT * FROM perguntas WHERE disciplina = ? AND turma = ? ORDER BY RANDOM() LIMIT 1`; 

    db.get(query, [disciplina, turma], (err, row) => {
        if(err){
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

//retorna todas as perguntas no banco de dados
app.get('/api/perguntas', (req, res) => {
    const query = 'SELECT * FROM perguntas';
  
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar perguntas:', err);
        res.status(500).json({ error: 'Erro ao buscar perguntas.' });
        return;
      }
  
      res.json(rows); // Envia as perguntas como resposta em formato JSON
    });
});

//retorna perguntas baseada em trecho
app.get('/api/search-pergunta',(req, res) => {
    const searchText = req.query.text;

    if(!searchText){
        res.status(400).json({ error: 'Texto de pesquisa não fornecido'});
        return;
    }

    const query = `SELECT * FROM perguntas WHERE pergunta LIKE '%${searchText}%'`;

    db.all(query, (err, rows) => {
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        
        res.json(rows);
    });
});

app.get('/api/rank', (req, res) => {
    const disciplina = req.query.disciplina;
    const turma = req.query.turma;
    const results = [];
    const filePath = path.join(__dirname, 'rank', `${disciplina}-${turma}.csv`);

    fs.createReadStream(filePath)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        const oddRows = results.filter((_, index) => index % 2 !== 0);

        oddRows.sort((a, b) => {
            if (a.Nota === b.Nota){
                return a.__index__ - b.__index__;
            }
            return b.Nota - a.Nota;
        });
        console.log(oddRows);
        res.json(oddRows);
    })
    .on('error', (error) => {
        console.error('Erro ao ler o arquivo CSV: ', error);
        res.status(500).send('Ocorreu um erro ao ler o arquivo CSV');
    });
});

app.get('/', (req, res) => {
    res.send("Olá Mundo! Está é a página inicial");
});

app.post('/api/addquestion', (req, res) => {
    const { pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma } = req.body;
    db.serialize(() => {
        adicionarPerguntaSeNova(pergunta, alternativa1, alternativa2, alternativa3, alternativa4,resposta, disciplina, turma);
    });

});


app.post('/api/completed', (req, res) => {
    const disciplina = req.query.disciplina;
    const turma = req.query.turma;
    const csvFilePath = path.join(__dirname, 'rank', `${disciplina}-${turma}.csv`);
    const { name, nota } = req.body;
    const currentTime = new Date().toLocaleString();

    const fileExists = fs.existsSync(csvFilePath);

    if(!fileExists){
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'name', title: 'Nome'},
                { id: 'score', title: 'Nota'},
                { id: 'time', title: 'Horário'},
            ],
        });

        csvWriter.writeRecords([]);
    }
// const dataExists = doesDataExist(name, nota, currentTime);
    // if(dataExists){
    //     return res.send('Dados já existem no arquivo CSV');
    // }

    const csvWriterAppend = createCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'name', title: 'Nome'},
            { id: 'nota', title: 'Nota'},
            { id: 'time', title: 'Horário'},
        ],
        append: true,
        fieldDelimiter: ';'
    });

    const dataToAdd = [{name, nota, time:currentTime}];

    try{
        csvWriterAppend.writeRecords(dataToAdd);
        res.send('Dados adicionados ao arquivo CSV com sucesso');
    } catch(error){
        console.log('Erro ao adicionar dados ao arquivo CSV: ', error);
        res.status(500).send('Ocorreu um erro ao adicionar os dados ao arquivo CSV');
    }
    // res.json({message: 'Dados recebidos com sucesso!', user: { name, nota }});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});

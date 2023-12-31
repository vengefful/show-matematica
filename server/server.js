const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const sqlite3 = require("sqlite3").verbose();
const multer = require('multer');

const app = express();
const dbPath = path.join(__dirname, 'questoes', 'questions.db');
const dbPathR = path.join(__dirname, 'rank', 'rank.db');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagens/');
    },
    filename: async (req, file, cb) => {
        const ultimoID = await newID();
        cb(null, ultimoID.toString() + path.extname(file.originalname));
    },
});

const uploadCsv = multer({ dest: 'uploads/' });

const upload = multer({ storage })

// folder static
// app.use(express.static(path.join(__dirname, 'rank')));
// app.use(express.static(path.join(__dirname, 'questoes')));
// app.use('/imagens', express.static(path.join(__dirname, 'imagens')));
app.use(express.json());

//Habilitar o CORS para todas as requisições
app.use(cors());

//criando conexao com o banco de dados sqlite
const dbR = new sqlite3.Database(dbPathR, (err) => {
    if(err) {
        console.error(err.message);
        throw err;
    } else{
        console.log(`Conectado ao banco de dados SQLite: ${dbPathR}`);
        createTableR();
    }
});

const db = new sqlite3.Database(dbPath, (err) => {
    if(err) {
        console.error(err.message);
        throw err;
    } else{
        console.log(`Conectado ao banco de dados SQLite: ${dbPath}`);
        createTable();
    }
});

const newID = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MAX(id) AS ultimo_id FROM perguntas';

        db.get(query, [], (err, row) => {
            if (err) {
                reject(err.message);
                return;
            }

            const ultimoID = row && row.ultimo_id ? row.ultimo_id + 1 : 1;
            resolve(ultimoID);
        });

    });
};

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
function createTableR(){
    dbR.run(`CREATE TABLE IF NOT EXISTS ranks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        nota FLOAT,
        data TEXT,
        escola TEXT,
        disciplina TEXT,
        turma TEXT
    )`, (err) => {
        if(err){
            console.log('Erro ao criar a tabela: ', err.message);
        } else{
            console.log('Tabela ranks criadas no banco de dados');
        }
    });
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

    const { disciplina, turma, exclusoes} = req.query;
    const exclusoesArray = exclusoes.split(',').map(Number);
    // const disciplina = req.query.disciplina;
    // const turma = req.query.turma;

    // query = `SELECT * FROM perguntas WHERE disciplina = ? AND turma = ? AND id != ? ORDER BY RANDOM() LIMIT 1`;
    const sql = `SELECT * FROM perguntas WHERE disciplina = ? AND turma = ? AND id NOT IN (${exclusoesArray.map(() => '?').join(', ')}) ORDER BY RANDOM() LIMIT 1`;

    db.get(sql, [disciplina, turma, ...exclusoesArray], (err, row) => {
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

//retorna todas os ranks no banco de dados
app.get('/api/ranks', (req, res) => {
    const query = 'SELECT * FROM ranks';

    dbR.all(query, [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar ranks:', err);
        res.status(500).json({ error: 'Erro ao buscar ranks.' });
        return;
      }

      res.json(rows); // Envia as perguntas como resposta em formato JSON
    });
});

app.get('/api/rank/:escola/:disciplina/:turma', (req, res) => {
    const {escola, disciplina, turma} = req.params;

    dbR.all(`SELECT * FROM ranks WHERE escola = ? AND disciplina = ? AND turma = ? ORDER BY nota DESC, data ASC`, [escola, disciplina, turma], (err, rows) => {
        if(err) {
            return res.status(500).json( {error: err.message });
        }
        res.status(200).json({ alunos: rows });
    })

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
    const { nome, nota, escola, disciplina, turma } = req.query;
    const currentTime = new Date().toLocaleString();
    console.log(nome,nota,escola,disciplina,turma);

    // Insira os dados na tabela 'ranks'
    dbR.run(`INSERT INTO ranks (nome, nota, data, escola, disciplina, turma) VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, nota, currentTime, escola, disciplina, turma],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Pessoa adicionada com sucesso!' });
        }
    );
});

app.post('/api/upload',upload.single('imagem'), (req, res) => {

    const { originalname } = req.file;

    try {
        if(!req.file){
            return res.status(400).send('Nenhuma imagem foi enviada');
        }

        const imageName = req.file.filename;
        res.status(200).json({ imageName });
    } catch (error) {
        res.status(500).send('Erro interno no servidor');
    }
});

app.get('/api/imagens/:imagem', (req, res) => {
    const img  = req.params;
    const imagemPath = path.join(__dirname, 'imagens', img.imagem);
    console.log(imagemPath);
    res.sendFile(imagemPath);
});

app.get('/api/ultimoID', (req, res) => {
    const query = 'SELECT MAX(id) AS ultimo_id FROM perguntas';

    db.get(query, [], (err, row) => {
        if (err) {
            res.status(500).send('Erro ao obter ultimo ID');
            return;
        }

        const ultimoID = row && row.ultimo_id ? row.ultimo_id + 1 : 1;
        res.json({ ultimoID });
    });
});

app.get('/api/perguntas/:disciplina', (req, res) => {
    const {disciplina} = req.params;

    db.all(`SELECT * FROM perguntas WHERE disciplina = ?`, [disciplina], (err, rows) => {
        if(err) {
            return res.status(500).json( {error: err.message });
        }
        res.status(200).json({ perguntas: rows });
    })
});

app.get('/api/perguntas/:disciplina/:turma', (req, res) => {
    const {disciplina, turma} = req.params;

    db.all(`SELECT * FROM perguntas WHERE disciplina = ? AND turma = ?`, [disciplina, turma], (err, rows) => {
        if(err) {
            return res.status(500).json( {error: err.message });
        }
        res.status(200).json({ perguntas: rows });
    })
});

app.get('/api/search-pergunta/:disciplina', (req, res) => {
    const {disciplina} = req.params;
    const searchText = req.query.text;

    if(!searchText){
        res.status(400).json({ error: 'Texto de pesquisa não fornecido'});
        return;
    }

    const query = `SELECT * FROM perguntas WHERE disciplina = ? AND pergunta LIKE '%${searchText}%'`;

    db.all(query, [disciplina], (err, rows) => {
        if(err) {
            return res.status(500).json( {error: err.message });
        }
        res.status(200).json(rows);
    })
});

app.get('/api/search-pergunta/:disciplina/:turma', (req, res) => {
    const {disciplina, turma } = req.params;
    const searchText = req.query.text;

    if(!searchText){
        res.status(400).json({ error: 'Texto de pesquisa não fornecido'});
        return;
    }

    const query = `SELECT * FROM perguntas WHERE disciplina = ? AND turma = ? AND pergunta LIKE '%${searchText}%'`;

    db.all(query, [disciplina, turma], (err, rows) => {
        if(err) {
            return res.status(500).json( {error: err.message });
        }
        res.status(200).json(rows);
    })
});

app.get('/api/pergunta/:id', (req, res) => {
    const {id} = req.params;

    const query = `SELECT * FROM perguntas WHERE id = ?`;

    db.all(query, [id], (err, row) => {
        if(err) {
            return res.status(500).json( {error: err.message });
        }
        res.status(200).json(row);
    })
});

app.put('/api/editar-pergunta/:id', (req, res) => {
    const {id} = req.params;
    const { pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma} =  req.body;

    const sql = `UPDATE perguntas SET pergunta = ?, alternativa1 = ?, alternativa2 = ?, alternativa3 = ?, alternativa4 = ?, resposta = ?, disciplina = ?, turma = ? WHERE id = ?`;
    db.run(sql, [pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma, id], function(err) {
        if(err){
            console.error(err.message);
        } else {
            console.log(`Pergunta com ID ${id} atualizada com sucesso`);
        }
    });
});

app.post('/api/uploadCSV', uploadCsv.single('file'), (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.forEach((row) => {
            adicionarPerguntaSeNova(row.pergunta, row.resposta1, row.resposta2, row.resposta3, row.resposta4, Number(row.numero_da_resposta), row.disciplina, row.turma);
        });
    });
});

// Rota para deletar a última pergunta da tabela 'perguntas'
app.delete('/api/deletar-ultima-pergunta', (req, res) => {
  db.serialize(() => {
    db.run("DELETE FROM perguntas WHERE ROWID = (SELECT MAX(ROWID) FROM perguntas)", (err) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.status(200).send('Última pergunta deletada com sucesso.');
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});

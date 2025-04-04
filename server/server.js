const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const sqlite3 = require("sqlite3").verbose();
const multer = require('multer');
const os = require('os');

const app = express();
const dbPath = path.join(__dirname, 'questoes', 'questions.db');
const dbPathR = path.join(__dirname, 'rank', 'rank.db');
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Permite conexões de qualquer IP na rede local

// Função para obter o IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Configuração do CORS
app.use(cors({
    origin: '*', // Permite acesso de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Configuração do body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota de teste
app.get('/api/test', (req, res) => {
    console.log('Teste de conexão recebido');
    res.json({ message: 'Servidor funcionando!' });
});

//rota para obter uma pergunta aleatoria do banco de dados
app.get('/api/pergunta', (req, res) => {
    const { disciplina, turma, exclusoes } = req.query;
    
    console.log('Recebida requisição GET em /api/pergunta');
    console.log('Query params:', { disciplina, turma, exclusoes });
    
    if (!disciplina || !turma) {
        console.log('Erro: Parâmetros disciplina e turma são obrigatórios');
        res.status(400).json({ error: 'Parâmetros disciplina e turma são obrigatórios' });
        return;
    }

    let query = 'SELECT * FROM perguntas WHERE disciplina = ? AND turma = ?';
    const params = [disciplina, turma];
    
    if (exclusoes && exclusoes.trim() !== '') {
        const exclusoesArray = exclusoes.split(',')
            .filter(id => id && id.trim() !== '')
            .map(Number)
            .filter(id => !isNaN(id));
            
        if (exclusoesArray.length > 0) {
            query += ` AND id NOT IN (${exclusoesArray.map(() => '?').join(',')})`;
            params.push(...exclusoesArray);
        }
    }
    
    query += ' ORDER BY RANDOM() LIMIT 1';
    
    console.log('Query:', query);
    console.log('Params:', params);
    
    db.get(query, params, (err, row) => {
        if (err) {
            console.error('Erro ao buscar pergunta:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!row) {
            console.log('Nenhuma pergunta encontrada para os parâmetros:', { disciplina, turma, exclusoes });
            res.status(404).json({ 
                error: 'Nenhuma pergunta encontrada',
                params: { disciplina, turma, exclusoes }
            });
            return;
        }
        
        console.log('Pergunta encontrada:', row);
        res.json(row);
    });
});

// Configurar para servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../client/build')));

// Configurar para servir arquivos de mídia
app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

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
        disciplina TEXT,
        turma TEXT
    )`, (err) => {
        if(err){
            console.log('Erro ao criar a tabela perguntas: ', err.message);
        } else{
            console.log('Tabela perguntas criada no banco de dados');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS pergunta_turmas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pergunta_id INTEGER,
        turma TEXT,
        FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
    )`, (err) => {
        if(err){
            console.log('Erro ao criar a tabela pergunta_turmas: ', err.message);
        } else{
            console.log('Tabela pergunta_turmas criada no banco de dados');
        }
    });
}

//retorna todas as perguntas no banco de dados
app.get('/api/perguntas', (req, res) => {
    console.log('Recebida requisição GET em /api/perguntas');
    const query = 'SELECT * FROM perguntas';

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar perguntas:', err);
        res.status(500).json({ error: 'Erro ao buscar perguntas.' });
        return;
      }

      console.log(`Encontradas ${rows.length} perguntas`);
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

// Rota para obter o ranking
app.get('/api/rank/:turma?/:disciplina?', (req, res) => {
    const { turma, disciplina } = req.params;
    let query = 'SELECT * FROM ranks';
    const params = [];

    if (turma && turma !== '') {
        query += ' WHERE turma = ?';
        params.push(turma);
    }

    if (disciplina && disciplina !== '') {
        if (params.length > 0) {
            query += ' AND disciplina = ?';
        } else {
            query += ' WHERE disciplina = ?';
        }
        params.push(disciplina);
    }

    query += ' ORDER BY nota DESC';

    dbR.all(query, params, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar ranking:', err);
            res.status(500).json({ error: 'Erro ao buscar ranking' });
            return;
        }
        res.json(rows);
    });
});

app.get('/', (req, res) => {


    res.send("Olá Mundo! Está é a página inicial");
});

app.post('/api/addquestion', (req, res) => {
    try {
        const { pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turmas } = req.body;
        
        // Validar campos obrigatórios
        const camposFaltantes = [];
        if (!pergunta) camposFaltantes.push('pergunta');
        if (!alternativa1) camposFaltantes.push('alternativa 1');
        if (!alternativa2) camposFaltantes.push('alternativa 2');
        if (!alternativa3) camposFaltantes.push('alternativa 3');
        if (!alternativa4) camposFaltantes.push('alternativa 4');
        if (!resposta) camposFaltantes.push('resposta');
        if (!disciplina) camposFaltantes.push('disciplina');
        if (!turmas || turmas.length === 0) camposFaltantes.push('turma');

        if (camposFaltantes.length > 0) {
            return res.status(400).json({ 
                error: 'Campos obrigatórios não preenchidos',
                campos: camposFaltantes,
                mensagem: `Por favor, preencha os seguintes campos: ${camposFaltantes.join(', ')}`
            });
        }

        // Validar tipo da resposta
        const respostaNum = parseInt(resposta);
        if (isNaN(respostaNum) || respostaNum < 1 || respostaNum > 4) {
            return res.status(400).json({ error: 'Resposta deve ser um número entre 1 e 4' });
        }

        // Validar turmas
        const turmasArray = Array.isArray(turmas) ? turmas : [turmas];
        if (turmasArray.length === 0) {
            return res.status(400).json({ error: 'Pelo menos uma turma deve ser selecionada' });
        }

        // Inserir a pergunta
        const stmt = db.prepare(`
            INSERT INTO perguntas (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Inserir para cada turma
        for (const turma of turmasArray) {
            stmt.run(
                pergunta,
                alternativa1,
                alternativa2,
                alternativa3,
                alternativa4,
                respostaNum,
                disciplina,
                turma
            );
        }

        stmt.finalize();
        res.status(200).json({ message: 'Pergunta adicionada com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar pergunta:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/completed', (req, res) => {
    const { nome, nota, escola, disciplina, turma } = req.query;
    
    if (!nome || !nota || !disciplina || !turma) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const stmt = dbR.prepare('INSERT INTO ranks (nome, nota, turma, disciplina, data_hora) VALUES (?, ?, ?, ?, datetime("now", "localtime"))');
    stmt.run(nome, nota, turma, disciplina, function(err) {
        if (err) {
            console.error('Erro ao salvar pontuação:', err);
            return res.status(500).json({ error: 'Erro ao salvar pontuação' });
        }
        res.json({ 
            id: this.lastID,
            nome,
            nota,
            turma,
            disciplina,
            data_hora: new Date().toISOString()
        });
    });
    stmt.finalize();
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
    const { disciplina } = req.params;
    console.log(`Buscando perguntas para disciplina: ${disciplina}`);
    
    const query = 'SELECT * FROM perguntas WHERE disciplina = ? ORDER BY id DESC';
    
    db.all(query, [disciplina], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar perguntas:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        console.log(`Encontradas ${rows.length} perguntas`);
        res.json({ perguntas: rows });
    });
});

// Rota para buscar perguntas
app.get('/api/perguntas/:disciplina/:turma', (req, res) => {
    const { disciplina, turma } = req.params;
    console.log(`Buscando perguntas para disciplina: ${disciplina}, turma: ${turma}`);
    
    const query = `
        SELECT p.* 
        FROM perguntas p
        WHERE p.disciplina = ? AND p.turma = ?
        ORDER BY RANDOM()
    `;
    
    console.log('Query:', query);
    console.log('Parâmetros:', [disciplina, turma]);
    
    db.all(query, [disciplina, turma], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar perguntas:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        console.log(`Encontradas ${rows.length} perguntas`);
        console.log('Perguntas:', rows);
        res.json(rows);
    });
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
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const results = [];
        const fileContent = fs.readFileSync(req.file.path, 'utf-8');
        const lines = fileContent.split('\n');
        
        // Validar cabeçalho
        const header = lines[0].trim().split(';');
        const expectedHeader = ['pergunta', 'alternativa1', 'alternativa2', 'alternativa3', 'alternativa4', 'resposta', 'turma', 'disciplina'];
        if (!header.every((h, i) => h.trim() === expectedHeader[i])) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ 
                error: 'Cabeçalho inválido. Formato esperado: pergunta;alternativa1;alternativa2;alternativa3;alternativa4;resposta;turma;disciplina',
                header: header,
                expected: expectedHeader
            });
        }
        
        // Pular cabeçalho e processar linhas
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, turma, disciplina] = line.split(';');
            
            // Validar campos obrigatórios
            if (!pergunta || !alternativa1 || !alternativa2 || !alternativa3 || !alternativa4 || !resposta || !turma || !disciplina) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: `Formato inválido na linha ${i}. Todos os campos são obrigatórios.`,
                    linha: i,
                    campos: { pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, turma, disciplina }
                });
            }

            // Validar tipo da resposta
            const respostaNum = parseInt(resposta);
            if (isNaN(respostaNum) || respostaNum < 1 || respostaNum > 4) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: `Resposta inválida na linha ${i}. Deve ser um número entre 1 e 4.`,
                    linha: i,
                    resposta: resposta
                });
            }

            // Validar turma
            const turmaTrim = turma.trim();
            if (!turmaTrim) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: `Turma não fornecida na linha ${i}. O campo turma é obrigatório.`,
                    linha: i,
                    turma: turma
                });
            }

            if (!turmaTrim.match(/^(EMMAT[1-3][A-E]|ARTIT7TARTEA|COOPIT7TCOOA|EMIT7T[1-3][A-D]|EMIT7T1A)$/)) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: `Turma inválida na linha ${i}. Formato deve ser EMMAT[1-3][A-E], ARTIT7TARTEA, COOPIT7TCOOA ou EMIT7T[1-3][A-D].`,
                    linha: i,
                    turma: turmaTrim
                });
            }

            // Validar disciplina
            const disciplinaTrim = disciplina.trim();
            if (!disciplinaTrim) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: `Disciplina não fornecida na linha ${i}. O campo disciplina é obrigatório.`,
                    linha: i,
                    disciplina: disciplina
                });
            }

            if (!['Matematica', 'Geografia'].includes(disciplinaTrim)) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ 
                    error: `Disciplina inválida na linha ${i}. Deve ser "Matematica" ou "Geografia".`,
                    linha: i,
                    disciplina: disciplinaTrim
                });
            }

            results.push({
                pergunta: pergunta.trim(),
                alternativa1: alternativa1.trim(),
                alternativa2: alternativa2.trim(),
                alternativa3: alternativa3.trim(),
                alternativa4: alternativa4.trim(),
                resposta: respostaNum,
                turma: turma.trim(),
                disciplina: disciplina.trim()
            });
        }

        if (results.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Nenhuma pergunta válida encontrada no CSV' });
        }

        // Inserir todas as perguntas
        const stmt = db.prepare(`
            INSERT INTO perguntas (pergunta, alternativa1, alternativa2, alternativa3, alternativa4, resposta, disciplina, turma)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const row of results) {
            stmt.run(
                row.pergunta,
                row.alternativa1,
                row.alternativa2,
                row.alternativa3,
                row.alternativa4,
                row.resposta,
                row.disciplina,
                row.turma
            );
        }

        stmt.finalize();
        fs.unlinkSync(req.file.path);
        res.status(200).json({ 
            message: 'Perguntas importadas com sucesso!',
            total: results.length
        });
    } catch (error) {
        console.error('Erro ao processar arquivo CSV:', error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
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

// Rota para servir a página de nova pergunta
app.get('/api/newquestion', (req, res) => {
    console.log('Recebida requisição GET em /api/newquestion');
    res.json({ message: 'Página de nova pergunta' });
});

// Rota para servir o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Rota para listar todas as perguntas
app.get('/api/perguntas', (req, res) => {
    console.log('Buscando todas as perguntas...');
    
    const db = new sqlite3.Database(dbPath);
    
    db.all(`
        SELECT * FROM perguntas 
        ORDER BY id DESC
    `, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar perguntas:', err);
            res.status(500).json({ error: 'Erro ao buscar perguntas' });
            return;
        }
        
        console.log(`Encontradas ${rows.length} perguntas`);
        console.log('Perguntas:', rows);
        
        res.json(rows);
    });
    
    db.close();
});

// Iniciar o servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
    console.log(`Para acessar localmente: http://localhost:${PORT}`);
    console.log(`Para acessar pela rede: http://SEU_IP_LOCAL:${PORT}`);
    console.log(`Banco de dados: ${dbPath}`);
    console.log(`Banco de rank: ${dbPathR}`);
});

app.post('/api/rank', (req, res) => {
    const { nome, nota, turma, disciplina } = req.body;
    
    if (!nome || !nota || !turma || !disciplina) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const stmt = dbR.prepare('INSERT INTO ranks (nome, nota, turma, disciplina, data_hora) VALUES (?, ?, ?, ?, datetime("now", "localtime"))');
    stmt.run(nome, nota, turma, disciplina, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao salvar pontuação' });
        }
        res.json({ 
            id: this.lastID,
            nome,
            nota,
            turma,
            disciplina,
            data_hora: new Date().toISOString()
        });
    });
    stmt.finalize();
});

app.get('/api/rank', (req, res) => {
    dbR.all('SELECT id, nome, nota, turma, disciplina, datetime(data_hora, "localtime") as data_hora FROM ranks ORDER BY nota DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar ranking' });
        }
        res.json(rows);
    });
});

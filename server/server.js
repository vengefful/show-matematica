const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');

const app = express();

// folder static
app.use(express.static(path.join(__dirname, 'questoes')));
app.use(express.static(path.join(__dirname, 'rank')));
app.use(express.json());

//Habilitar o CORS para todas as requisições
app.use(cors());

//Função para verificar se os dados já existem no arquivo CSV
const doesDataExist = async (name, nota, time) => {
    const csvFilePath = path.join(__dirname, 'rank', 'rank.csv');
    if(!fs.existsSync(csvFilePath)) return false;

    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    if(!csvContent) return false;

    const lines = csvContent.trim().split('\n');
    for (const line of lines){
        const [existingName, existingNota, existingTime] = line.split(';');
        console.log(existingName, Number(existingNota), existingTime);
        if(existingName === name && Number(existingNota) === nota && existingTime === time){
            return true;
        }
    }
    return false;
};

//Rota de exemplo para dados
app.get('/api/data', (req, res) => {
    const filePath = path.join(__dirname, 'questoes', 'questions.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo CSV');
        }

        const linhas = data.split('\n');
        const headers = linhas[0].slice(0, -1).split(';');

        const dados = linhas.slice(1).map((linha) => {
            const colunas = linha.slice(0, -1).split(';');

            return headers.reduce((obj, header, index) => {
                obj[header] = colunas[index];
                return obj;
            }, {});
        });
        res.json(dados);
    });
});

app.get('/api/rank', (req, res) => {
    const results = [];
    const filePath = path.join(__dirname, 'rank', 'rank.csv');

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


app.post('/api/completed', (req, res) => {
    const csvFilePath = path.join(__dirname, 'rank', 'rank.csv');
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

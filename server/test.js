const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ message: 'Teste funcionando!' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de teste rodando em http://0.0.0.0:${PORT}`);
}); 
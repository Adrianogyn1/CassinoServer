const express = require('express');
const path = require('path');
const SalaRoleta = require('./SalaRoleta');
const SalaBaccarat = require('./SalaBaccarat');
const SalaBacboo = require('./SalaBacboo');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

const salas = [
    new SalaRoleta('roleta1', 4001),
    new SalaRoleta('roleta2', 4002),
    new SalaBaccarat('baccarat1', 4003),
    new SalaBacboo('bacboo1', 4004)
];

app.get('/api/rooms', (req, res) => {
    res.json(salas.map(s => ({
        tipo: s.tipo,
        nome: s.nome,
        porta: s.porta,
        status: s.status,
        history: s.history.slice(-5)
    })));
});

app.listen(PORT, () => console.log(`Servidor master rodando na porta ${PORT}`));

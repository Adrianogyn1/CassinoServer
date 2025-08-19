const express = require('express');
const cors = require('cors');
const SalaRoleta = require('./SalaRoleta');
const SalaBacarat = require('./SalaBacarat');
const SalaBacboo = require('./SalaBacboo');

const app = express();
app.use(express.json());
app.use(cors()); // habilita CORS para todas as origens
app.use(express.static('public')); // serve Index.html e games/

// criar salas
const salas = [
    new SalaRoleta('roleta1', 4001),
    new SalaRoleta('roleta2', 4002),
    new SalaBacarat('baccarat1', 4003),
    new SalaBacboo('bacboo1', 4004)
];

// iniciar servidores de cada sala
salas.forEach(s => s.startServer());

// API para listar salas
app.get('/api/rooms', (req, res) => {
    const result = salas.map(s => ({
        tipo: s.tipo,
        nome: s.nome,
        porta: s.porta,
        status: s.status,
        history: s.history
    }));
    res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor master rodando na porta ${PORT}`));

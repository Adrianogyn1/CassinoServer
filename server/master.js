const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const SalaRoleta = require('./SalaRoleta');
const SalaBaccarat = require('./SalaBaccarat');
const SalaBacboo = require('./SalaBacboo');

const app = express();
app.use(express.json());
app.use(cors()); // habilita CORS para todas as origens
app.use(express.static('public')); // serve Index.html e games/


//io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // cuidado em produção
        methods: ["GET", "POST"]
    }
});



// criar salas
const salas = [
    new SalaRoleta('Immersiver'),
    new SalaRoleta('Auto Roolete'),
    new SalaRoleta('Stake'),
    new SalaRoleta('Brasileira'),
    
    new SalaBaccarat('Baccarat 1'),
    new SalaBaccarat('Baccarat 2'),
    new SalaBaccarat('Baccarat 3'),
    new SalaBaccarat('Stake Bacarat'),
    new SalaBacboo('Bacboo Live'),
    new SalaBacboo('Bacboo ao vivo')
];

// iniciar cada sala
salas.forEach(s => s.Start());

// API para listar salas
app.get('/api/rooms', (req, res) => {
    const result = salas.map(s => (
        s.GetInfo()
    ));
    res.json(result);
});

//socket service
io.on("connection", (socket) =>
{
    console.log("Novo usuário conectado:", socket.id);
    
    
    
    // cliente informa para qual sala quer entrar
    socket.on("joinRoom", (roomName) => {
        const sala = salas.find(c => c.nome == roomName);
        if (!sala) {
            socket.emit("error", "Sala não encontrada");
            return;
        }
        
        
        sala.AddUser(socket);
        //bet
        socket.on("mybet", (data) =>
        {
            sala.RegisterBet(data, socket);
        });
        // quando sair
        socket.on("disconnect", () => {
            sala.RemoveUser(socket);
            console.log("Usuário saiu:", socket.id, "da sala", roomName);
        });
    });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor master rodando na porta ${PORT}`));
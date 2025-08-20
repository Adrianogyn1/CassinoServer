const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const SalaRoleta = require('./SalaRoleta');
//const SalaBacarat = require('./SalaBaccarat');
//const SalaBacboo = require('./SalaBacboo');

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
    new SalaRoleta('Immersiver', 10),
    new SalaRoleta('Auto Roolete',10),
    new SalaRoleta('Stake', 10),
    new SalaRoleta('Brasileira',10),
    
    //new SalaBacarat('baccarat1', 4003),
    //new SalaBacboo('bacboo1', 4004)
];

// iniciar cada sala
salas.forEach(s => s.Start());

// API para listar salas
app.get('/api/rooms', (req, res) => {
    const result = salas.map(s => (
        s.GetInfo()
        /*{
        nome: s.nome,
        users: 0, //s.users.length,
        status: s.status,
        history: s.history.splice(5)
    
            
        }*/
        
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
        
        // quando sair
        socket.on("disconnect", () => {
            sala.RemoveUser(socket);
            console.log("Usuário saiu:", socket.id, "da sala", roomName);
        });
    });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor master rodando na porta ${PORT}`));
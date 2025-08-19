const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const SalaBacarat = require('./SalaBacarat');
const SalaFootballStudio = require('./SalaFootballStudio');
const SalaBacboo = require('./SalaBacboo');
const SalaRoleta = require('./SalaRoleta');

const PORT = process.env.PORT || 3000;

// -----------------------------
// Servidor HTTP para index.html
// -----------------------------
const server = http.createServer((req, res) => {
    // Servir apenas a página inicial
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Erro ao carregar a página");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end("Página não encontrada");
    }
});

// -----------------------------
// WebSocket
// -----------------------------
const wss = new WebSocket.Server({ server });

// -----------------------------
// Criar salas fixas
// -----------------------------
const salas = {
    bacarat: [
        new SalaBacarat('bacarat1'),
        new SalaBacarat('bacarat2')
    ],
    footballStudio: [
        new SalaFootballStudio('footballelvivo'),
        new SalaFootballStudio('footballlive')
    ],
    bacboo: [
        new SalaBacboo('bacboo1')
    ],
    roleta: [
        new SalaRoleta('roleta1'),
        new SalaRoleta('roleta2')
    ]
};

// Iniciar loop de rodadas
Object.values(salas).flat().forEach(sala => sala.iniciarRodada());

// -----------------------------
// Conexão de clientes
// -----------------------------
wss.on('connection', ws => {
    console.log('Cliente conectado');
    let userSala = null;

    ws.on('message', message => {
        let msg;
        try {
            msg = JSON.parse(message);
        } catch {
            ws.send(JSON.stringify({ type: "error", error: "JSON inválido" }));
            return;
        }

        switch (msg.type) {
            case 'joinRoom': {
                const { tipo, room } = msg;
                const sala = salas[tipo]?.find(s => s.nome === room);
                if (!sala) {
                    ws.send(JSON.stringify({ type: "error", error: "A sala " + room + " não existe" }));
                    return;
                }
                userSala = sala;
                userSala.adicionarCliente(ws);
                ws.send(JSON.stringify({ type: "joinRoom", message: "success" }));
                console.log(`Cliente entrou na sala: ${tipo} / ${room}`);
                break;
            }

            case 'exitRoom': {
                if (userSala) {
                    userSala.removerCliente(ws);
                    ws.send(JSON.stringify({ type: "exitRoom", message: "success" }));
                    console.log(`Cliente saiu da sala: ${userSala.tipo} / ${userSala.nome}`);
                    userSala = null;
                } else {
                    ws.send(JSON.stringify({ type: "error", error: "Você não está em nenhuma sala" }));
                }
                break;
            }

            case 'getRooms': {
                const result = {};
                Object.keys(salas).forEach(tipo => result[tipo] = salas[tipo].map(s => s.nome));
                ws.send(JSON.stringify({ type: "roomsList", data: result }));
                break;
            }

            default:
                ws.send(JSON.stringify({ type: "error", error: "Tipo de mensagem desconhecido" }));
                break;
        }
    });

    ws.on('close', () => {
        if (userSala) userSala.removerCliente(ws);
        console.log('Cliente desconectado');
    });
});

// -----------------------------
// Iniciar servidor HTTP + WS
// -----------------------------
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

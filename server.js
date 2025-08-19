const WebSocket = require('ws');
const SalaBacarat = require('./SalaBacarat');
const SalaFootballStudio = require('./SalaFootballStudio');
const SalaBacboo = require('./SalaBacboo');
const SalaRoleta = require('./SalaRoleta');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

// Criar salas fixas
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

// Iniciar loop de rodadas para todas as salas (único por sala)
Object.values(salas).flat().forEach(sala => sala.iniciarRodada());

// Conexão de clientes
wss.on('connection', ws => {
  let userSala = null;

  ws.on('message', message => {
    const msg = JSON.parse(message);

    switch(msg.type) {
      case 'joinRoom': {
        const { tipo, room } = msg;
        const sala = salas[tipo]?.find(s => s.nome === room);
        if (!sala) {
          ws.send(JSON.stringify({ type: "error", error: "A sala "+room+" não existe" }));
          return;
        }

        // Sai da sala anterior, se houver
        if (userSala && userSala !== sala) {
          userSala.removerCliente(ws);
        }

        userSala = sala;
        userSala.adicionarCliente(ws);
        ws.send(JSON.stringify({ type: "joinRoom", message: "success" }));
        break;
      }

      case 'exitRoom': {
        if (userSala) {
          userSala.removerCliente(ws);
          userSala = null;
        }
        ws.send(JSON.stringify({ type: "exitRoom", message: "success" }));
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
    }
  });

  ws.on('close', () => {
    if (userSala) userSala.removerCliente(ws);
  });
});

console.log(`Servidor WebSocket rodando na porta ${PORT}`);

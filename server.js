const WebSocket = require('ws');
const SalaBacarat = require('./SalaBacarat');
const SalaFootballStudio = require('./SalaFootballStudio');
const SalaBacboo = require('./SalaBacboo');
const SalaRoleta = require('./SalaRoleta');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

// criar salas fixas
const salas = {
  bacarat: [new SalaBacarat('bacarat1'), new SalaBacarat('bacarat2')],
  footballStudio: [new SalaFootballStudio('football1')],
  bacboo: [new SalaBacboo('bacboo1')],
  roleta: [new SalaRoleta('roleta1'), new SalaRoleta('roleta2')]
};

// iniciar loop de rodadas
Object.values(salas).flat().forEach(sala => sala.iniciarRodada());

// conexão de clientes
wss.on('connection', ws => {
  let userSala = null;

  ws.on('message', message => {
    const msg = JSON.parse(message);

    if (msg.type === 'joinRoom') {
      const { tipo, room } = msg;
      const sala = salas[tipo]?.find(s => s.nome === room);
      if (!sala) {
        ws.send(JSON.stringify({ type: "error", message: "Sala não existe" }));
        return;
      }
      userSala = sala;
      userSala.adicionarCliente(ws);
    }

    if (msg.type === 'getRooms') {
      const result = {};
      Object.keys(salas).forEach(tipo => result[tipo] = salas[tipo].map(s => s.nome));
      ws.send(JSON.stringify({ type: "roomsList", data: result }));
    }
  });

  ws.on('close', () => {
    if (userSala) userSala.removerCliente(ws);
  });
});

console.log(`Servidor WebSocket rodando na porta ${PORT}`);

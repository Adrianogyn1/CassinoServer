const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });
const history = [];
const MAX_HISTORY = 500;

console.log(`Servidor WebSocket rodando na porta ${PORT}`);

wss.on('connection', ws => {
  console.log('Cliente conectado!');

  // envia histórico inicial
  ws.send(JSON.stringify({ type: "history", data: history }));

  // gera números aleatórios a cada 1s
  const interval = setInterval(() => {
    const num = Math.floor(Math.random() * 1000);
    history.push(num);
    if (history.length > MAX_HISTORY) history.shift();

    // envia para todos clientes
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "newNumber", data: num }));
      }
    });
  }, 1000);

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
  });
});

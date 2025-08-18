const SalaBase = require('./SalaBase');

class SalaBacboo extends SalaBase {
  constructor(nome) {
    super('bacboo', nome);
  }

  async resultado() {
    this.status = 'resultado';
    this.broadcastStatus();

    // gera dados aleatórios (ex: 0 a 9)
    const dados = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    this.broadcastNewData(dados);

    this.history.push(dados);
    if (this.history.length > 500) this.history.shift();

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "roundResult", data: dados, tipo: this.tipo, room: this.nome }));
      }
    });

    return dados;
  }
}

module.exports = SalaBacboo;

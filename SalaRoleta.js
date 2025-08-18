const SalaBase = require('./SalaBase');

class SalaRoleta extends SalaBase {
  constructor(nome) {
    super('roleta', nome);
  }

  async resultado() {
    this.status = 'resultado';
    this.broadcastStatus();

    // gera número aleatório de 0 a 36
    const numero = Math.floor(Math.random() * 37);

    // salva no histórico
    this.history.push(numero);
    if (this.history.length > 500) this.history.shift();

    // envia resultado para todos clientes
    this.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: "roundResult", data: numero, tipo: this.tipo, room: this.nome }));
      }
    });

    return numero;
  }
}

module.exports = SalaRoleta;

const SalaBase = require('./SalaBase');
const { criarBaralho, cartaValue } = require('./utils');

class SalaFootballStudio extends SalaBase {
  constructor(nome) {
    super('footballStudio', nome);
    this.deck = criarBaralho();
  }

  async resultado() {
    this.status = 'resultado';
    this.broadcastStatus();

    if (this.deck.length < 6) this.deck = criarBaralho();

    const cartasJogador = [this.deck.shift(), this.deck.shift()];
    const cartasBanqueiro = [this.deck.shift(), this.deck.shift()];

    for (const carta of cartasJogador) {
      this.broadcastNewCard(carta, 'jogador');
      await new Promise(r => setTimeout(r, 500));
    }
    for (const carta of cartasBanqueiro) {
      this.broadcastNewCard(carta, 'banqueiro');
      await new Promise(r => setTimeout(r, 500));
    }

    const rodada = { jogador: cartasJogador, banqueiro: cartasBanqueiro };
    this.history.push(rodada);
    if (this.history.length > 120) this.history.shift();

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "roundResult", data: rodada, tipo: this.tipo, room: this.nome }));
      }
    });

    return rodada;
  }
}

module.exports = SalaFootballStudio;

function criarBaralho() {
  const naipes = ['♠', '♥', '♦', '♣'];
  const valores = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const baralho = [];
  for (const naipe of naipes) {
    for (const valor of valores) {
      baralho.push({ valor, naipe });
    }
  }
  for (let i = baralho.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
  }
  return baralho;
}

function cartaValue(carta) {
  if (!carta) return 0;
  if (['10','J','Q','K'].includes(carta.valor)) return 0;
  if (carta.valor === 'A') return 1;
  return parseInt(carta.valor);
}

module.exports = { criarBaralho, cartaValue };

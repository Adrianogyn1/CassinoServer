class SalaBase 
{
  constructor(tipo, nome)
  {
    this.tipo = tipo;
    this.nome = nome;
    this.clients = new Set();
    this.history = [];
    this.tempoAposta = 10;
    this.status = 'aguardando'; // 'aberta', 'fechada', 'resultado', 'pagamento'
  }
  
  adicionarCliente(ws)
  {
    this.clients.add(ws);
    ws.send(JSON.stringify({ type: "history", data: this.history, tipo: this.tipo, room: this.nome }));
    broadcastUserCount();
  }
  
  removerCliente(ws)
  {
    this.clients.delete(ws);
    broadcastUserCount();
  }
  
  async iniciarRodada()
  {
    while (true)
    {
      await this.abrirApostas(this.tempoAposta * 1000);
      await this.fecharApostas(500);
      const resultado = await this.resultado();
      await this.pay(resultado, 500);
    }
  }
  
  abrirApostas(ms)
  {
    this.status = 'aberta';
    this.broadcastStatus();
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  fecharApostas(ms)
  {
    this.status = 'fechada';
    this.broadcastStatus();
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // cada sala filha implementa seu próprio resultado
  async resultado()
  {
    //   throw new Error("Método resultado() precisa ser implementado na subclasse");
  }
  
  pay(resultado, ms)
  {
    this.status = 'pagamento';
    this.broadcastStatus();
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  broadcastStatus()
  {
    this.clients.forEach(client =>
    {
      if (client.readyState === WebSocket.OPEN)
      {
        client.send(JSON.stringify({ type: "status", data: this.status, tipo: this.tipo, room: this.nome }));
      }
    });
  }
  
  broadcastNewCard(carta, destino)
  {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN)
      {
        client.send(JSON.stringify({ type: "newCard", data: { carta, destino }, tipo: this.tipo, room: this.nome }));
      }
    });
  }
  
  broadcastNewData(data) 
  {
    this.clients.forEach(client =>
    {
      if (client.readyState === WebSocket.OPEN)
      {
        client.send(JSON.stringify({ type: "newData", data, tipo: this.tipo, room: this.nome }));
      }
    });
  }
  
  broadcastUserCount()
  {
    const msg = JSON.stringify({ type: "userCount", data: { room: this.nome, count: this.clients.size } });
    this.clients.forEach(c => 
    {
        if (c.readyState === c.OPEN) 
            c.send(msg);
    });
    
  }
}

module.exports = SalaBase;
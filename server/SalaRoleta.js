const SalaBase = require('./SalaBase');

class SalaRoleta extends SalaBase
{
    constructor(nome)
    {
        super("roleta",nome,20);
    }
    
  async  GerarResultado()
    {
        const numero = Math.floor(Math.random() * 37);
        
        const resultado = {
            numero: numero,
            time: new Date().toISOString()
        };
        
        this.AddResultado(resultado);
        await this.Esperar(1000);
    }
    
    GetInfo()
    {
        return {
            game :this.game,
            nome: this.nome,
            users: this.userCount, //s.users.length,
            status: this.status,
            image: this.image,
            history: this.history.map(n => n.numero).reverse().splice(0,10)
        };
    }
}

module.exports = SalaRoleta;
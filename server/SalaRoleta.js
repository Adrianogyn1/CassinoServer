const SalaBase = require('./SalaBase');

class SalaRoleta extends SalaBase
{
    constructor(nome, tempoAposta)
    {
        super("roleta",nome, tempoAposta);
    }
    
    GerarResultado()
    {
        const numero = Math.floor(Math.random() * 37);
        
        const resultado = {
            numero: numero,
            time: new Date().toISOString()
        };
        
        this.AddResultado(resultado);
    }
    
    GetInfo()
    {
        return {
            game :this.game,
            nome: this.nome,
            users: this.userCount, //s.users.length,
            status: this.status,
            history: this.history.map(n => n.numero).reverse().splice(10)
        };
    }
}

module.exports = SalaRoleta;
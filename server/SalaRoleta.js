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
            users: this.users.length, //s.users.length,
            status: this.status,
            history: this.history.map(n => n.numero).splice(5)
        };
    }
}

module.exports = SalaRoleta;
const SalaBase = require('./SalaBase');

class SalaRoleta extends SalaBase
{
    constructor(nome, tempoAposta)
    {
        super(nome, tempoAposta);
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
            nome: this.nome,
            users: this.users.length, //s.users.length,
            status: this.status,
            history: this.history.splice(10).map(n => n.numero)
        };
    }
}

module.exports = SalaRoleta;
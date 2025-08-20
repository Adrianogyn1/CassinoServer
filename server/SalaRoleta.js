const SalaBase = require('./SalaBase');

class SalaRoleta extends SalaBase {
    constructor(nome) 
    {
        super(nome);
    }

    GerarResultado() 
    {
        const resultado = Math.floor(Math.random() * 36);
        this.AddResultado(resultado);
    }
}

module.exports = SalaRoleta;

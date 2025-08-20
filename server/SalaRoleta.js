const SalaBase = require('./SalaBase');

class SalaRoleta extends SalaBase {
    constructor(nome, tempoAposta) {
        super(nome, tempoAposta);
    }

    GerarResultado() {
        const numero = Math.floor(Math.random() * 37);
        const cor = numero === 0 ? "verde" : (numero % 2 === 0 ? "preto" : "vermelho");

        const resultado = {
            numero,
            cor,
            hora: new Date().toISOString()
        };

        this.AddResultado(resultado);
    }
}

module.exports = SalaRoleta;

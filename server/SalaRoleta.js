const SalaBase = require('./SalaBase');

class SalaRoleta extends SalaBase {
    constructor(nome, porta) {
        super('Roleta', nome, porta);
        this.startServer();
        this.startGameLoop();
    }

    startGameLoop() {
        setInterval(() => {
            const resultado = Math.floor(Math.random() * 36);
            this.addResultado(resultado);
        }, 5000);
    }
}

module.exports = SalaRoleta;

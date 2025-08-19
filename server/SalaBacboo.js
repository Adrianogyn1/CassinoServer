const SalaBase = require('./SalaBase');

class SalaBacboo extends SalaBase {
    constructor(nome, porta) {
        super('Bacboo', nome, porta);
        this.startServer();
        this.startGameLoop();
    }

    startGameLoop() {
        setInterval(() => {
            const resultado = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ]; // 2 dados para cada lado
            this.addResultado(resultado);
        }, 5000);
    }
}

module.exports = SalaBacboo;

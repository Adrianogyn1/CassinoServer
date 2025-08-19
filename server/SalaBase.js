class SalaBase {
    constructor(tipo, nome, porta) {
        this.tipo = tipo;
        this.nome = nome;
        this.porta = porta;
        this.history = [];
        this.status = 'aguardando';
        this.io = null;
    }

    startServer() {
        const { Server } = require('socket.io');
        this.io = new Server(this.porta, { cors: { origin: "*" } });
        console.log(`${this.nome} (${this.tipo}) rodando em porta ${this.porta}`);

        this.io.on('connection', socket => {
            console.log(`Cliente conectado na sala ${this.nome}`);
            socket.emit('history', this.history);

            socket.on('disconnect', () => {
                console.log(`Cliente desconectou da sala ${this.nome}`);
            });
        });
    }

    addResultado(resultado) {
        this.history.push(resultado);
        if (this.history.length > 20) this.history.shift();
        this.io.emit('newResult', resultado);
    }
}

module.exports = SalaBase;

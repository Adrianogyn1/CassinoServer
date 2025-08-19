class SalaBase {
    constructor(tipo, nome, porta) {
        this.tipo = tipo;
        this.nome = nome;
        this.porta = porta;
        this.history = [];
        this.status = 'aguardando';
        this.io = null;
        this.interval = null;
    }

    startServer() {
        const { Server } = require('socket.io');
        this.io = new Server(this.porta, { cors: { origin: "*" } });
        console.log(`${this.nome} (${this.tipo}) rodando em porta ${this.porta}`);

        this.io.on('connection', socket => {
            console.log(`Cliente conectado na sala ${this.nome}`);

            // envia histórico e status atuais
            socket.emit('history', this.history);
            socket.emit('status', this.status);

            socket.on('disconnect', () => {
                console.log(`Cliente desconectou da sala ${this.nome}`);
            });
        });

        // iniciar rodada automaticamente
        this.startRodadas();
    }

    startRodadas() {
        // padrão: gerar resultado a cada 5s (subclasses podem sobrescrever)
        this.interval = setInterval(() => {
            const resultado = this.gerarResultado();
            this.addResultado(resultado);
        }, 5000);
    }

    gerarResultado() {
        // método a ser sobrescrito por cada tipo de sala
        throw new Error('gerarResultado() precisa ser implementado na subclasse');
    }

    addResultado(resultado) {
        this.history.push(resultado);
        if (this.history.length > 20) this.history.shift();

        // envia para todos os clientes
        if (this.io) this.io.emit('newResult', { room: this.nome, data: resultado });
    }

    updateStatus(status) {
        this.status = status;
        if (this.io) this.io.emit('status', { room: this.nome, status });
    }

    stop() {
        if (this.interval) clearInterval(this.interval);
        if (this.io) this.io.close();
    }
}

module.exports = SalaBase;

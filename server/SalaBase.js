class SalaBase {
    constructor(nome, tempoAposta = 20) {
        this.nome = nome;
        this.history = [];
        this.status = 'aguardando';
        this.users = new Set();

        this.tempoAposta = tempoAposta;
        this.tempoAtual = tempoAposta; // começa cheio
    }

    forEachUser(callback) {
        for (const user of this.users) {
            if (user.connected) callback(user);
        }
    }

    AddResultado(resultado) {
        this.history.push(resultado);
        if (this.history.length > 20) this.history.shift();
        this.forEachUser(user => user.emit('newResult', { room: this.nome, data: resultado }));
    }

    BroadcastStatus() {
        this.forEachUser(user => user.emit('status', { room: this.nome, status: this.status }));
    }

    BroadcastTempo() {
        this.forEachUser(user => user.emit('tempo', { room: this.nome, tempo: this.tempoAtual }));
    }

    AddUser(user) {
        this.users.add(user);
        user.emit('history', this.history);
        user.emit('status', this.status);
        user.emit('tempo', this.tempoAtual);
    }

    RemoveUser(user) {
        this.users.delete(user);
    }

    async Start() {
        while (true) {
            if (this.status === 'aguardando' || this.status === 'apostas_aberta') {
                this.status = 'apostas_aberta';
                this.BroadcastStatus();

                while (this.tempoAtual > 0) {
                    this.BroadcastTempo();
                    await this.Esperar(1000);
                    this.tempoAtual--;
                }

                this.status = 'apostas_fechada';
                this.BroadcastStatus();
                await this.Esperar(1000);

                this.GerarResultado();
               

                this.tempoAtual = this.tempoAposta; // reinicia contador
                this.status = 'aguardando';
                this.BroadcastStatus();
            }
        }
    }

    GerarResultado() {
        throw new Error('GerarResultado() precisa ser implementado na subclasse');
    }

    Esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class SalaBase
{
    constructor(game, nome, tempoAposta, image = "")
    {
        this.game = game;
        this.nome = nome;
        this.history = [];
        this.status = 'aguardando';
        this.users = new Set();
        this.userCount = 0;
        this.bets = [];
        this.image = image;
        
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
        this.forEachUser(user => user.emit('newResult', resultado));
    }
    
    BroadcastStatus() {
        this.forEachUser(user => user.emit('status', this.status));
    }
    
    BroadcastTempo() {
        this.forEachUser(user => user.emit('tempo', this.tempoAtual));
    }
    
    BroadcastParcial(result) {
        this.forEachUser(user => user.emit('round', result));
    }
    
    AddUser(user) {
        this.users.add(user);
        user.emit('history', this.history);
        user.emit('status', this.status);
        user.emit('tempo', this.tempoAtual);
        this.userCount++;
    }
    
    RemoveUser(user) {
        this.users.delete(user);
        this.userCount--;
    }
    
    RegisterBet(bet, user) {
        let myBet = this.bets.find(c => c.user === user);
        
        if (!myBet) {
            myBet = { bet: bet, user: user };
            this.bets.push(myBet);
        } else {
            myBet.bet = bet; // atualiza aposta já existente
        }
        
        user.emit("registerBet", true);
    }
    
    PayoutBets(result) {}
    SendPayout(user, msg) {
        user.emit("payout", msg);
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
                
                await this.GerarResultado();
                
                
                this.tempoAtual = this.tempoAposta; // reinicia contador
                this.status = 'aguardando';
                this.BroadcastStatus();
            }
        }
    }
    
    async GerarResultado() {
        throw new Error('GerarResultado() precisa ser implementado na subclasse');
    }
    
    GetInfo()
    {
        return {
            game: this.game,
            nome: this.nome,
            users: this.userCount, //s.users.length,
            status: this.status,
            history: this.history.reverse().splice(0, 5)
        };
    }
    
    Esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = SalaBase;
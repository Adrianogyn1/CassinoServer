const SalaBase = require('./SalaBase');

class SalaBaccarat extends SalaBase {
    constructor(nome) {
        super("baccarat", nome, 20);
        this.banker = new Set();
        this.player = new Set();
    }

    async GerarResultado() 
    {
        
        this.AddResultado({
            banker: this.banker,
            player: this.player,
            vencedor:"b",
            time: 0
        });
        
        await this.Esperar(1000);
    }
    
    GetInfo()
    {
        return {
            game :this.game,
            nome: this.nome,
            users: this.userCount, //s.users.length,
            status: this.status,
            history: this.history.map(n => n.vencedor).reverse().splice(10)
        };
    }
}

module.exports = SalaBaccarat;

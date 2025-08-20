const SalaBase = require('./SalaBase');

class SalaBaccarat extends SalaBase {
    constructor(nome) {
        super("baccarat", nome, 20);
    }

    async GerarResultado() 
    {
        
        this.AddResultado({
            banker: {card1: 1, card2:2},
            player: {card1: 1, card2:2},
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

const SalaBase = require('./SalaBase');

class SalaFantan extends SalaBase {
    constructor(nome, image = "") {
        super("foottball", nome, 20, image);
            }
    
    async GerarResultado() {

        await this.Esperar(2000);
    }
    
    PayoutBets(result) {
        
    }
    
    
    
    
    GetInfo() {
        return {
            game: this.game,
            nome: this.nome,
            users: this.userCount,
            status: this.status,
            image: this.image,
            history: this.history.map(n => n.vencedor).reverse().slice(0, 10)
        };
    }
}

module.exports = SalaFantan;
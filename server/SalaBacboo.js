const SalaBase = require('./SalaBase');

class SalaBacboo extends SalaBase {
    constructor(nome) {
        super('bacboo', nome, 20);

        this.banker = { dados: [], complete: false };
        this.player = { dados: [], complete: false };
    }

    async GerarResultado() {
        // reset mãos
        this.banker.dados = [];
        this.player.dados = [];
        this.banker.complete = false;
        this.player.complete = false;

        let result = {
            banker: this.banker,
            player: this.player,
            vencedor: "*",
            time: new Date().toISOString()
        };

        for (let i = 0; i < 2; i++) {
            // player
            this.player.dados[i] = Math.floor(Math.random() * 6) + 1;
            result.player = { ...this.player };
            this.BroadcastParcial(result);
            await this.Esperar(500);

            // banker
            this.banker.dados[i] = Math.floor(Math.random() * 6) + 1;
            result.banker = { ...this.banker };
            this.BroadcastParcial(result);
            await this.Esperar(1000);
        }

        let b = this.banker.dados[0] + this.banker.dados[1];
        let p = this.player.dados[0] + this.player.dados[1];

        result.vencedor = b === p ? "d" : (p > b ? "p" : "b");

        this.banker.complete = true;
        this.player.complete = true;
        this.AddResultado(result);
    }
    
    GetInfo() {
        return {
            game: this.game,
            nome: this.nome,
            users: this.userCount,
            status: this.status,
            history: this.history.map(n => n.vencedor).reverse().slice(0, 10)
        };
    }
}

module.exports = SalaBacboo;

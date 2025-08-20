const SalaBase = require('./SalaBase');
const { Baralho } = require("./cartas.js");

class SalaBaccarat extends SalaBase {
    constructor(nome) {
        super("baccarat", nome, 20);
        this.banker = [];
        this.player = [];
        this.baralho = new Baralho(6, "bc"); // 6 ou 8 baralhos
    }

    async GerarResultado() {
        // reset mãos
        this.banker = [];
        this.player = [];

        let result = {
            banker: this.banker,
            player: this.player,
            vencedor: "*",
            time: new Date().toISOString()
        };

        // Player 2 cartas
        for (let i = 0; i < 2; i++) {
            let carta = this.baralho.Retirar();
            this.player.push(carta);
            result.player = [...this.player];
            this.BroadcastParcial(result);
            await this.Esperar(500);
        }

        // Banker 2 cartas
        for (let i = 0; i < 2; i++) {
            let carta = this.baralho.Retirar();
            this.banker.push(carta);
            result.banker = [...this.banker];
            this.BroadcastParcial(result);
            await this.Esperar(500);
        }

        // calcula totais iniciais
        let pTotal = this.getTotal(this.player);
        let bTotal = this.getTotal(this.banker);

        // natural? (8 ou 9)
        if (pTotal < 8 && bTotal < 8) {
            // Player compra 3ª carta se <= 5
            let playerThird = null;
            if (pTotal <= 5) {
                playerThird = this.baralho.Retirar();
                this.player.push(playerThird);
                result.player = [...this.player];
                this.BroadcastParcial(result);
                await this.Esperar(500);
                pTotal = this.getTotal(this.player);
            }

            // Banker decide
            if (playerThird === null) {
                // Player não comprou 3ª carta
                if (bTotal <= 5) {
                    let carta = this.baralho.Retirar();
                    this.banker.push(carta);
                    result.banker = [...this.banker];
                    this.BroadcastParcial(result);
                    await this.Esperar(500);
                    bTotal = this.getTotal(this.banker);
                }
            } else {
                // Player comprou 3ª carta
                let v = playerThird.valor;
                if (bTotal <= 2) {
                    let carta = this.baralho.Retirar();
                    this.banker.push(carta);
                } else if (bTotal === 3 && v !== 8) {
                    this.banker.push(this.baralho.Retirar());
                } else if (bTotal === 4 && v >= 2 && v <= 7) {
                    this.banker.push(this.baralho.Retirar());
                } else if (bTotal === 5 && v >= 4 && v <= 7) {
                    this.banker.push(this.baralho.Retirar());
                } else if (bTotal === 6 && (v === 6 || v === 7)) {
                    this.banker.push(this.baralho.Retirar());
                }

                result.banker = [...this.banker];
                this.BroadcastParcial(result);
                await this.Esperar(500);
                bTotal = this.getTotal(this.banker);
            }
        }

        // decisão final
        result.vencedor = (pTotal === bTotal) ? "d" : (pTotal > bTotal ? "p" : "b");

        this.AddResultado(result);
        await this.Esperar(1000);
    }

    // calcula soma no Baccarat (último dígito)
    getTotal(cartas) {
        return cartas.reduce((acc, c) => acc + c.valor, 0) % 10;
    }

    BroadcastParcial(result) {
        this.forEachUser(user => user.emit('round', result));
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

module.exports = SalaBaccarat;

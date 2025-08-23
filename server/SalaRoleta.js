const SalaBase = require('./SalaBase');
const NumInfo = require('./NumInfo');

class SalaRoleta extends SalaBase {
    constructor(nome, image = "") {
        super("roleta", nome, 20, image);
        this.pretos = 0;
        this.vermelhos = 0;
        this.total = 0;
    }

    async GerarResultado() {
        const numero = Math.floor(Math.random() * 37);
        const info = new NumInfo(numero);

        if (info.color === "red") {
            this.vermelhos++;
        }
        if (info.color === "black") {
            this.pretos++;
        }

        this.total++;

        const resultado = {
            numero: numero,
            numInfo: info,
            time: new Date().toISOString()
        };

        this.AddResultado(resultado);
        await this.Esperar(1000);
    }

    GetInfo() {
        return {
            total: this.total,
            vermelho: this.vermelhos,
            pretos: this.pretos,

            game: this.game,
            nome: this.nome,
            users: this.userCount, // certifique-se que SalaBase define isso
            status: this.status,
            image: this.image,
            history: this.history.map(n => n.numero).reverse().slice(0, 10)
        };
    }
}

module.exports = SalaRoleta;

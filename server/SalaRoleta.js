const SalaBase = require('./SalaBase');
const NumInfo = require('./NumInfo');

class SalaRoleta extends SalaBase {
    constructor(nome, image = "") {
        super("roleta", nome, 20, image);
        this.pretos = 0;
        this.vermelhos = 0;
        this.total = 0;
        this.last = 0;
    }
    
    async GerarResultado() {
        
        /*
        const voltas = Math.floor(Math.random() * 5) + 1; // 1 a 5 voltas
        const numeros = NumInfo.numeros; // array de 0 a 36
        const whellSize = numeros.length;

        // Índice inicial (começa de last, ou 0 se for o primeiro giro)
        let startIndex = this.last ? numeros.indexOf(this.last) : 0;

        // Cria array simulando as voltas
        const whell = [];
        for (let v = 0; v < voltas; v++) {
            whell.push(...numeros);
        }

        // Escolhe índice final de forma segura dentro do array
        const totalSize = whell.length;
        const relativeOffset = Math.floor(Math.random() * whellSize); // offset aleatório na última volta
        const targetIndex = ((startIndex + relativeOffset) % whellSize) + (voltas - 1) * whellSize;
       */
        const numero = Math.round(Math.random() * 37); // whell[targetIndex];
        
        const info = new NumInfo(numero);
        
        // Atualiza contadores
        if (info.color === "red") this.vermelhos++;
        if (info.color === "black") this.pretos++;
        this.total++;
        this.last = numero;
        
        // Cria resultado
        const resultado = {
            numero: numero,
            numInfo: info,
            time: new Date().toISOString()
        };
        //round start ui?
        this.BroadcastParcial(resultado);
        // Simula o tempo de roleta girando
        await this.Esperar(10000);
        //envia o resultado 
        this.AddResultado(resultado);
        //faz o pagamento 
        this.PayoutBets(resultado);
        // pausa para recomeçar 20+10+2=32 total de 32 seg por rodada
        await this.Esperar(2000);
    }
    
    
    PayoutBets(result) 
    {
        this.bets.forEach(c =>
        {
            let valor = 0;
            
            try 
            {
                var bt = c.bet.find(el =>  el.numero == result.numero )[0];
                if (bt)
                    valor = bt.valor * 36;
                else {
                    c.user.emit("log","nao encontado bet ")
                }
                
                if (valor > 0) {
                    // console.log("bet ganho no número"+ result.numero +", valor" + valor + c.bet.map(i=> i.numero+' valor '+i.valor));
                    this.SendPayout(c.user, valor);
                }
                
            } catch (e) {
                c.user.emit("log",e);
                console.log(e);
            }
        });
        
        // limpa apostas para próxima rodada
        this.bets = [];
    }
    
    GetInfo() {
        return {
            total: this.total,
            vermelho: this.vermelhos,
            pretos: this.pretos,
            game: this.game,
            nome: this.nome,
            users: this.userCount,
            status: this.status,
            image: this.image,
            history: this.history.map(n => n.numero).reverse().slice(0, 10)
        };
    }
}

module.exports = SalaRoleta;
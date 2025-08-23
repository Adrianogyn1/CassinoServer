const SalaBase = require('./SalaBase');
const SalaBase = require('./NunInfo');

class SalaRoleta extends SalaBase
{
    constructor(nome,image="")
    {
        super("roleta",nome,20,image);
        this.pretos =0;
        this.vermelhos=0;
        this.total = 0;
    }
    
  async  GerarResultado()
    {
        const numero = Math.floor(Math.random() * 37);
        var info = new NumInfo(numero);
        if(info.color == "red")
        this.vermelhos++;
        if(info.color == "black")
        this.pretos++;
        
        this.total++;
        
        
        const resultado = {
            numero: numero,
            numInfo:info,
            time: new Date().toISOString()
        };
        
        this.AddResultado(resultado);
        await this.Esperar(1000);
    }
    
    GetInfo()
    {
        return {
            //testes
            total:this.total,
            vermelho:thia.vermelho,
            pretos:this.pretos,
            
            //fim
            game :this.game,
            nome: this.nome,
            users: this.userCount, //s.users.length,
            status: this.status,
            image: this.image,
            history: this.history.map(n => n.numero).reverse().splice(0,10)
        };
    }
}

module.exports = SalaRoleta;
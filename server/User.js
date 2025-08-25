const { pool, createUserTable } = require("./db");

class User {
    constructor(nome) {
        this.id =0;
        this.nome = nome;
        this.history = [];
        this.saldo = 1000;
    }

    async Save() {
        try {
            createUserTable();
            
            const sql = `
                INSERT INTO users (id,nome, saldo, history) 
                VALUES (?,?, ?, ?)
                ON DUPLICATE KEY UPDATE saldo=?, history=?;
            `;
            
            await pool.query(sql, [
                this.id,
                this.nome,
                this.saldo,
                JSON.stringify(this.history),
                this.saldo,
                JSON.stringify(this.history)
            ]);

            console.log(`✅ Usuário ${this.nome} salvo com sucesso!`);
        } catch (err) {
            console.error("❌ Erro ao salvar usuário:", err);
        }
    }

    async SetSaldo(_saldo) {
        this.saldo += _saldo;
        await this.Save();
    }

    static async Load(nome) {
        try {
            const [rows] = await pool.query("SELECT * FROM users WHERE nome = ?", [nome]);

            if (rows.length === 0) {
                console.log(`⚠️ Usuário ${nome} não encontrado, criando novo...`);
                return new User(nome);
            }

            const data = rows[0];
            const user = new User(data.nome);
            user.saldo = data.saldo;
            user.history = JSON.parse(data.history || "[]");

            return user;
        } catch (err) {
            console.error("❌ Erro ao carregar usuário:", err);
            return null;
        }
    }
}

module.exports = { User };

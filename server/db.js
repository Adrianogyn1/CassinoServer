const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "sql10.freesqldatabase.com",
  user: "sql10795983",
  password: "tTiJ4T7WFs",
  database: "sql10795983"
});

async function createUserTable() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        saldo DECIMAL(15,2) NOT NULL DEFAULT 0,
        history TEXT
      );
    `;

    await pool.query(sql);
    console.log("✅ Tabela 'users' criada/verificada com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabela:", err);
  }
}

module.exports = { pool, createUserTable };

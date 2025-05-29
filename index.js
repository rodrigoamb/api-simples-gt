const express = require("express");
const { Client } = require("pg");

const app = express();

app.use(express.json()); // diz para o express que estamos usando JSON

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "loja_dripstore",
  password: "30267098",
  port: 5432,
});

client
  .connect()
  .then(async () => {
    console.log("Conectado ao banco de dados.");

    await client.query(
      `
      CREATE TABLE IF NOT EXISTS clientes (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            telefone VARCHAR(15)
      );
      `
    );

    console.log("Tabelas criadas com sucesso.");
  })
  .catch((error) => {
    console.error("Erro ao conectar com o banco", error);
  });

app.get("/clientes", async (req, res) => {
  const result = await client.query("SELECT * FROM clientes");

  res.json(result.rows);
});

app.post("/clientes", async (req, res) => {
  const { nome, email, telefone } = req.body;

  if (!nome || !email) {
    res.status(404).json({ message: "Deve ser enviado um nome e um email" });
  }

  await client.query(
    "INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3)",
    [nome, email, telefone]
  );

  res.status(201).json({ message: "Cliente criado com sucesso!" });
});

//---- iniciando servidor

app.listen(3000, () => {
  console.log("Servidor API rodando na porta 3000");
});

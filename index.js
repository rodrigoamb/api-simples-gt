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

// ----- ENTIDADE CLIENTES --------

// ROTA GET - CLIENTES - TRAZ TODOS OS CLIENTES
app.get("/clientes", async (req, res) => {
  const result = await client.query("SELECT * FROM clientes");

  res.json(result.rows);
});

//ROTA GET - CLIENTES - TRAZ O CLIENTE FILTRADO PELO ID
app.get("/clientes/:id", async (req, res) => {
  const id = req.params.id;

  const result = await client.query("SELECT * FROM clientes WHERE id = $1", [
    id,
  ]);

  const meuObjeto = result.rows[0];

  res.status(200).json(meuObjeto);
});

// ROTA POST - CLIENTES - CRIA UM NOVO CLIENTE
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

// ROTA PUT - CLIENTES - ATUALIZA OS DADOS DO CLIENTE POR ID
app.put("/clientes/:id", async (req, res) => {
  const { nome, email, telefone } = req.body;
  const id = req.params.id;

  await client.query(
    "UPDATE clientes SET nome = $1 , email = $2 , telefone = $3 WHERE id = $4",
    [nome, email, telefone, id]
  );

  res.status(200).json({ message: "Cliente atualizado com sucesso." });
});

// ROTA DELETE - CLIENTES - DELETA UM CLIENTE POR ID
app.delete("/clientes/:id", async (req, res) => {
  const id = req.params.id;

  await client.query("DELETE FROM clientes WHERE id = $1", [id]);

  res.status(200).json({ message: "Cliente deletado com sucesso." });
});

//---- iniciando servidor

app.listen(3000, () => {
  console.log("Servidor API rodando na porta 3000");
});

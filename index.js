const express = require("express");
const { Client } = require("pg");

const app = express();

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

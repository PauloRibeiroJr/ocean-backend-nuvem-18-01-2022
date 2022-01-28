const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

//const url = "mongodb://localhost:27017";
// const url = "mongodb+srv://admin:hd2rV5duoPrrIi3t@cluster0.jup2c.mongodb.net/";
//const url = "mongodb+srv://adm:96188499@cluster0.a1dlo.mongodb.net";
const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}`;

//const dbName = "ocean_bancodados_18_01_2022";
//const dbName = "ocean_bkend_20220118";

async function main() {
  // Conexão com o Banco de Dados

  const client = await MongoClient.connect(url);

  const db = client.db(dbName);

  const collection = db.collection("herois");

  //const collection = undefined;

  const cors = require("cors");

  // Aplicação em Express

  const app = express();

  // Sinalizo para o Express que o body das requisições
  // estará sempre estruturado em JSON
  app.use(express.json());

  app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    app.use(cors());
    next();
  });

  // Endpoint "/"
  app.get("/", function (req, res) {
    res.send("Hello, World!");
  });

  // Endpoint "/oi"
  app.get("/oi", function (req, res) {
    res.send("Olá, mundo!");
  });

  app.get("/oi/:name", async function (req, res) {
    const nome = req.params.name;

    const item = { nome: nome };

    await collection.insertOne(item);

    res.send("Olá, " + nome);
  });

  const lista = ["Mulher Maravilha", "Capitã Marvel", "Homem de Ferro"];
  //              0                   1                2

  // [GET] "/herois" - Read All (Ler todos os registros)
  app.get("/herois", async function (req, res) {
    // if (
    //   !req.headers.authorization ||
    //   req.headers.authorization.indexOf("Basic ") === -1
    // ) {
    //   return res.status(401).json({ message: "Missing Authorization Header" });
    // }
    res.set("Access-Control-Allow-Origin", "*");
    const documentos = await collection.find().toArray();

    res.send(documentos);
  });

  // [GET] "/herois/:id" - Read Single (by Id) (Ler um registro pelo ID)
  app.get("/herois/:id", async function (req, res) {
    const id = req.params.id;

    const item = await collection.findOne({ _id: new ObjectId(id) });

    res.send(item);
  });

  // [POST] "/herois" - Create (Criar um registro)
  app.post("/herois", async function (req, res) {
    const item = req.body;

    res.send(item);

    await collection.insertOne(item);

    //res.send(item);
  });

  // [PUT] "/herois/:id" - Update (Atualizar um registro)
  app.put("/herois/:id", async function (req, res) {
    const id = req.params.id;

    const item = req.body;

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: item,
      }
    );

    res.send(item);
  });

  // [DELETE] "/herois/:id" - Delete (Remover um registro)
  app.delete("/herois/:id", async function (req, res) {
    const id = req.params.id;

    await collection.deleteOne({ _id: new ObjectId(id) });

    res.send("Item removido com sucesso.");
  });
  //Permitir que outra app recuper dados
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.listen(process.env.PORT || 3001);
}

main();

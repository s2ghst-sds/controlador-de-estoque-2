const express = require("express");
const cors = require("cors");
require("./config/db");
const ctrlRoutes = require("./routes/ctrlRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.status(200).send("Bem-vindo à API integrado ao FrontEnd");
});

app.use("/produtos", ctrlRoutes);

app.listen(PORT, () => {
  console.log(`Servidor de produtos rodando na porta ${PORT}`);
});
const express = require("express");
const cors = require("cors");
require("./config/db");
const ctrlRoutes = require("./routes/ctrlRoutes");
const emailRoutes = require("./routes/emailRoutes");
const dotenv = require("dotenv");

dotenv.config();



const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).send("Bem-vindo à API integrado ao FrontEnd");
});

app.use("/produtos", ctrlRoutes);
app.use("/", emailRoutes);


const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
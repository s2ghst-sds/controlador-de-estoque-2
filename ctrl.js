const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const ctrlRoutes = require("./routes/ctrlRoutes");
const emailRoutes = require("./routes/emailRoutes");
const pictureRouter = require("./routes/picture");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


dotenv.config();
require("./config/db");


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).send("Bem-vindo à API do Projeto de Controle de Estoque!");
});

app.use("/", emailRoutes);
app.use("/produtos", ctrlRoutes);
app.use("/pictures", pictureRouter);
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);    // Rotas de autenticação
app.use("/user", userRoutes);    // Rotas de usuário




const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
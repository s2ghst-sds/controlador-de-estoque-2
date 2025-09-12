const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

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
app.use(express.static(path.join(__dirname, 'public'))); // Arquivos estáticos



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
});

app.get("/ctrl", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'ctrl.html'));
});

app.use("/", emailRoutes);
app.use("/produtos", ctrlRoutes);
app.use("/pictures", pictureRouter);
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);    // Rotas de autenticação
app.use("/user", userRoutes);    // Rotas de usuário
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta} 👌`);
});
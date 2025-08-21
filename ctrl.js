const express = require("express");
const cors = require("cors");
const ctrlRoutes = require("./routes/ctrlRoutes");
const emailRoutes = require("./routes/emailRoutes");
const dotenv = require("dotenv");
const app = express();
const pictureRouter = require("./routes/picture");


dotenv.config();
require("./config/db");


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).send("Bem-vindo à API integrado ao FrontEnd");
});

app.use("/", emailRoutes);
app.use("/produtos", ctrlRoutes);
app.use("/pictures", pictureRouter);
app.use("/uploads", express.static("uploads"));



const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
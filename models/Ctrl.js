const mongoose = require("mongoose");

/*

exemplo, codigo antigo.

const ToDoSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
});

module.exports = mongoose.model("ToDo", ToDoSchema, "Frontend");

*/

const StockCtrlSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  desc: { type: String },
  preco: { type: Number },
  qntd: { type: Number }
});

module.exports = mongoose.model("StockCtrl", StockCtrlSchema, "estoquedecontrolador");

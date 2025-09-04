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
  desc: { type: String, required: true },
  categoria: { type: String, required: true },
  precocompra: { type: Number, required: true },
  precovenda: { type: Number, required: true },
  validade: { type: Date },
  qntd: { type: Number, required: true },
  imagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Picture'
  }
});

module.exports = mongoose.model("StockCtrl", StockCtrlSchema, "estoquedecontrolador");

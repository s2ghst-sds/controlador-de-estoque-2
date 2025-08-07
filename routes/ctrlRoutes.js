const express = require("express");
const StockCtrl = require("../controllers/Ctrlcontroller");
const router = express.Router();

// Listar todas as tarefas
router.get("/", StockCtrl.getAll);

// Buscar tarefa por ID
router.get("/:id", StockCtrl.getById);

// Criar nova tarefa (sem validação)
router.post("/", StockCtrl.create);

// Atualizar tarefa (sem validação)
router.put("/:id", StockCtrl.update);

// Deletar tarefa
router.delete("/:id", StockCtrl.remove);

module.exports = router;
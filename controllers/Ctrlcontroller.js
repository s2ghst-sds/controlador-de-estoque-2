const StockCtrl = require("../models/Ctrl");

// Listar todas as tarefas
exports.getAll = async (req, res) => {
  try {
    const produtos = await StockCtrl.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

// Buscar tarefa por ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await StockCtrl.findById(id);
    if (!produto) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar tarefa" });
  }
};

// Criar nova tarefa
exports.create = async (req, res) => {
  const { nome, desc, preco, qntd } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: "Nome é obrigatório" });
  }
  try {
    const novoProduto = new StockCtrl({
      nome,
      desc,
      preco: Number(preco),
      qntd: Number(qntd)
    });
    await novoProduto.save();
    res.status(201).json(novoProduto);  
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar produto" });
  }
};

// Atualizar prod
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, desc, preco, qntd } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: "nome é obrigatória" });
  }
  try {
    const produto = await StockCtrl.findByIdAndUpdate(id,
      { nome, desc, preco, qntd },
      { new: true, runValidators: true });
    if (!produto) {
      return res.status(404).json({ erro: "produto não encontrada" });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
};

// Deletar tarefa
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await StockCtrl.findByIdAndDelete(id);
    if (!produto) {
      return res.status(404).json({ erro: "prod não encontrada" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: "Erro ao remover prod" });
  }
}; 
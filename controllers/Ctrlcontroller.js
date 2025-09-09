const StockCtrl = require("../models/Ctrl");
const Picture = require("../models/Picture");
const createTransporter = require("../config/email");
const dotenv = require("dotenv");
const fs = require("fs");

// Listar todas as tarefas
exports.getAll = async (req, res) => {
  try {
    const produtos = await StockCtrl.find().populate('imagem');
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

// Buscar produto por ID
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

// Criar novo produto
exports.create = async (req, res) => {

  const { nome, desc, categoria, precocompra, precovenda, validade, qntd } = req.body;
  const file = req.file;

  if (!nome || !desc || !categoria || !precocompra || !precovenda || !validade || !qntd || !file) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }
  try {

    const picture = new Picture({
      name: "imagem de " + nome,
      src: file.path,
    });
    await picture.save();



    const novoProduto = new StockCtrl({
      nome,
      desc,
      categoria,
      precocompra: Number(precocompra),
      precovenda: Number(precovenda),
      validade: new Date(validade),
      qntd: Number(qntd),
      imagem: picture._id
    });

    await novoProduto.save();
    this.verificarEstoque(novoProduto);
    const produtoComImagem = await StockCtrl.findById(novoProduto._id).populate('imagem');
    res.status(201).json(produtoComImagem);



  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar produto" });
  }
};

// Atualizar prod
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, desc, categoria, precocompra, precovenda, validade, qntd } = req.body;
  if (!nome || !desc || !categoria || !precocompra || !precovenda || !validade || !qntd) {
    return res.status(400).json({ erro: "Todos os campos são obrigatorios!" });
  }
  try {
    const produto = await StockCtrl.findByIdAndUpdate(id,
      { nome, desc, categoria, precocompra, precovenda, validade, qntd },
      { new: true, runValidators: true });
    if (!produto) {
      return res.status(404).json({ erro: "produto não encontrada" });
    }
    this.verificarEstoque(produto);
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

exports.getPublicProducts = async (req, res) => {
  try {
    const produtos = await StockCtrl.find()
      .populate('imagem')
      .select('-precocompra -validade -qntd'); // Exclui campos sensíveis

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoria } = req.params;
    const produtos = await StockCtrl.find({ categoria })
      .populate('imagem')
      .select('-precocompra -validade -qntd');

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos por categoria" });
  }
};

exports.verificarEstoque = async (produto) => {
  const ESTOQUE_MINIMO = 5; // Define o limite mínimo

  if (produto.qntd <= ESTOQUE_MINIMO) {
    try {
      const transportador = createTransporter();

      await transportador.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.SMTP_USER, // Email do administrador
        subject: `⚠️ Alerta de Estoque Baixo: ${produto.nome}`,
        html: `
          <h2>Alerta de Estoque Baixo</h2>
          <p>O produto <strong>${produto.nome}</strong> está com estoque baixo.</p>
          <ul>
            <li>Quantidade atual: <strong>${produto.qntd} unidades</strong></li>
            <li>Limite mínimo: ${ESTOQUE_MINIMO} unidades</li>
            <li>Categoria: ${produto.categoria || 'Não informada'}</li>
          </ul>
          <p>Por favor, reabasteça o estoque.</p>
        `
      });

      console.log(`E-mail de alerta enviado para ${produto.nome}`);
    } catch (erro) {
      console.error("Erro ao enviar e-mail de alerta:", erro.message);
    }
  }
};

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
      qntdmin: Number(qntd),
      imagem: picture._id
    });

    await novoProduto.save();
    exports.verificarEstoque(novoProduto);
    exports.verificarValidade(novoProduto);
    const produtoComImagem = await StockCtrl.findById(novoProduto._id).populate('imagem');
    res.status(201).json(produtoComImagem);



  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar produto" });
  }
};

// Atualizar prod
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, desc, categoria, precocompra, precovenda, validade, qntd, qntdmin } = req.body;
  if (!nome || !desc || !categoria || !precocompra || !precovenda || !validade || !qntd || !qntdmin) {
    return res.status(400).json({ erro: "Todos os campos são obrigatorios!" });
  }
  try {
    const produto = await StockCtrl.findByIdAndUpdate(id,
      { nome, desc, categoria, precocompra, precovenda, validade, qntd, qntdmin },
      { new: true, runValidators: true });
    if (!produto) {
      return res.status(404).json({ erro: "produto não encontrada" });
    }
    exports.verificarEstoque(produto);
    exports.verificarValidade(produto);
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
      .select('-precocompra -validade -qntd -qntdmin'); // Exclui campos sensíveis

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
      .select('-precocompra -validade -qntd -qntdmin');

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos por categoria" });
  }
};

exports.verificarEstoque = async (produto) => {

  if (produto.qntd <= produto.qntdmin) {
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
            <li>Limite mínimo: ${produto.qntdmin} unidades</li>
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


// Função original melhorada
exports.verificarValidade = async (produto) => {
  if (!produto.validade) return;

  const hoje = new Date();
  const dataValidade = new Date(produto.validade);
  const diffTime = dataValidade - hoje;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Verifica se está dentro do período de alerta (7 dias ou menos)
  if (diffDays <= 7) {
    try {
      const transportador = createTransporter();

      let assunto = '';
      if (diffDays < 0) {
        assunto = `❌ PRODUTO VENCIDO: ${produto.nome}`;
      } else if (diffDays === 0) {
        assunto = `⚠️ PRODUTO VENCE HOJE: ${produto.nome}`;
      } else {
        assunto = `⚠️ Alerta de Validade: ${produto.nome}`;
      }

      await transportador.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: assunto,
        html: `
          <h2>Alerta de Validade</h2>
          <p>O produto <strong>${produto.nome}</strong> 
          ${diffDays < 0 ? `está <strong>VENCIDO</strong> desde ${dataValidade.toLocaleDateString('pt-BR')}`
            : (diffDays === 0 ? 'vence <strong>HOJE</strong>'
              : `vencerá em <strong>${diffDays} dias</strong> (${dataValidade.toLocaleDateString('pt-BR')})`)}.
          </p>
          <ul>
            <li>Nome: <strong>${produto.nome}</strong></li>
            <li>Data de validade: ${dataValidade.toLocaleDateString('pt-BR')}</li>
            <li>Dias restantes: ${diffDays < 0 ? 'VENCIDO' : diffDays + ' dias'}</li>
            <li>Categoria: ${produto.categoria || 'Não informada'}</li>
            <li>Quantidade em estoque: ${produto.qntd} unidades</li>
          </ul>
          <p>Por favor, tome as providências necessárias.</p>
        `
      });

      console.log(`E-mail de validade enviado para ${produto.nome}`);
    } catch (erro) {
      console.error("Erro ao enviar e-mail de validade:", erro.message);
    }
  }
};

const agendarVerificacaoDiaria = () => {
  // Executa todos os dias às 08:00
  const agenda = require('node-schedule');
  const regra = '* * 8 * * *'; // Todos os dias às 08:00

  agenda.scheduleJob(regra, async () => {
    console.log('Executando verificação diária de validades...');
    try {
      const produtos = await StockCtrl.find({ validade: { $exists: true, $ne: null } });

      for (const produto of produtos) {
        await exports.verificarValidade(produto);
      }

      console.log('Verificação diária de validades concluída.');
    } catch (error) {
      console.error('Erro na verificação automática:', error);
    }
  });
};

setImmediate(() => {
  agendarVerificacaoDiaria();
  console.log("Verificação diaria de validades 📌 ");
  
});
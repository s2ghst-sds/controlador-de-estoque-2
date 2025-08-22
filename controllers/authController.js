const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usuarioModel");



//07 - Depois criar o arquivo MODEL
exports.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body; // Obtém os dados do corpo da requisição

  // validations
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" }); // Retorna um erro 422 se o nome não for fornecido
  }

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" }); // Retorna um erro 422 se o email não for fornecido
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" }); // Retorna um erro 422 se a senha não for fornecida
  }

  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação precisam ser iguais!" }); // Retorna um erro 422 se as senhas não coincidirem
  }

  // check if user exists
  const userExists = await User.findOne({ email: email }); // Verifica se já existe um usuário com o mesmo email

  if (userExists) {
    return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" }); // Retorna um erro 422 se o email já estiver em uso
  }

  // create password
  const salt = await bcrypt.genSalt(12); // Gera um salt para criptografar a senha
  const passwordHash = await bcrypt.hash(password, salt); // Cria um hash da senha usando o salt

  // create user
  const newuser = new User({
    name,
    email,
    password: passwordHash, // Salva o hash da senha no banco de dados
  });

  try {
    await newuser.save(); // Salva o novo usuário no banco de dados

    res.status(201).json({ msg: "Usuário criado com sucesso!" }); // Retorna uma mensagem de sucesso
  } catch (error) {
    res.status(500).json({ msg: error }); // Retorna um erro 500 se algo der errado ao salvar o usuário
  }
});



//08
exports.post("/auth/login", async (req, res) => {
  const { email, password } = req.body; // Obtém os dados do corpo da requisição

  // validations
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" }); // Retorna um erro 422 se o email não for fornecido
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" }); // Retorna um erro 422 se a senha não for fornecida
  }

  // check if user exists
  const user = await User.findOne({ email: email }); // Busca o usuário no banco de dados pelo email

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" }); // Retorna um erro 404 se o usuário não for encontrado
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password); // Compara a senha fornecida com o hash armazenado

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" }); // Retorna um erro 422 se a senha estiver incorreta
  }

  //09 Fazer um env secret para evitar se hackeado
  try {
    const secret = process.env.SECRET; // Obtém a chave secreta a partir das variáveis de ambiente

    const token = jwt.sign(
      {
        id: user._id, // Cria um token JWT contendo o ID e nome do usuário
        name: user.name,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token }); // Retorna o token JWT
  } catch (error) {
    res.status(500).json({ msg: error }); // Retorna um erro 500 se algo der errado ao gerar o token
  }

  //Ainda não sabe lidar com token iremos realizar a tratativa no passo 10
});


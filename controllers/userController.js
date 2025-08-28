const User = require("../models/UserModel");

// Busca usuário (rota pública - mantido do original)
const getUserPublic = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id, "-password");

  if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });

  res.status(200).json({ user });
};

// Busca usuário (rota privada - mantido do original)
const getUserPrivate = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return res.status(404).json({ msg: "Usuário não encontrado!" });

  res.status(200).json({ msg: "Voce está ná Área Restrita", user });
};



module.exports = { getUserPublic, getUserPrivate };
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Middleware para verificar token JWT (mantido do original)
exports.checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ msg: "O Token é inválido!" });
  }
}

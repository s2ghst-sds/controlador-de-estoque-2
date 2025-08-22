const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Define rotas de autenticação
router.post("/auth/register", register); // Rota de registro
router.post("/auth/login", login);       // Rota de login

module.exports = router;
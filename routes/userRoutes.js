const express = require("express");
const { getUserPublic, getUserPrivate } = require("../controllers/userController");
const { checkToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Define rotas de usuário
router.get("/public/:id", getUserPublic);     // Rota pública
router.get("/:id", checkToken, getUserPrivate); // Rota privada com autenticação

module.exports = router;
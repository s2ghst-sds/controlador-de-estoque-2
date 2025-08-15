const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/registrar", emailController.registrar);
router.post("/enviar-email", emailController.enviarEmail);

module.exports = router;

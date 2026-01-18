const { Router } = require("express");
const { authController } = require("../controllers");
const { signUp, login } = authController;
const router = Router();

router.post("/signup", signUp).post("/login", login);

module.exports = router;

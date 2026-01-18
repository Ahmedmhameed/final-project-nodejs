const { Router } = require("express");
const { likeController } = require("../controllers");
const { addLike } = likeController;
const { auth } = require("../middlewares");
const router = Router();

router.post("/taggle", auth, addLike);

module.exports = router;

const { Router } = require("express");
const { articleController } = require("../controllers");
const { getArticles, getArticle } = articleController;
const { auth } = require("../middlewares");
const router = Router();

router.get("/", auth, getArticles).get("/:id", auth, getArticle);

module.exports = router;

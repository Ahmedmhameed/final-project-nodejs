const authRouter = require("./auth");
const likeRouter = require("./like");
const articleRouter = require("./articles");

module.exports = (app) => {
  app.get("/home", (req, res, next) => {
    res.send("<h1>Hello in my Final Project Home page</h1>");
  });
  app.get("/", (req, res, next) => {
    res.redirect("/home");
  });
  app.use("/auth", authRouter);
  app.use("/like", likeRouter);
  app.use("/articles", articleRouter);
};

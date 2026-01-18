require("dotenv").config();
const { createServer } = require("http");
const app = require("./app");
const { getArticles } = require("./my_modules/get_articles_from_web");
const mongoose = require("mongoose");
const { Article } = require("./models");

const server = createServer(app);

const port = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("✅ Connected to MongoDB");
  console.log("Checking New Articles");

  const { status, data: newArticles } = await getArticles();
  console.log("Storing New Articles: " + newArticles.length);

  if (status && newArticles.length > 0)
    Article.saveAll(newArticles, (result) => {
      if (result.status) console.log("Saved");
      else console.log(result.message);
    });
});

server.listen(port, () => {
  console.log("You are listening to port http://localhost:" + port);
});

require("dotenv").config();
const { createServer } = require("http");
const app = require("./app");

const server = createServer(app);

const port = process.env.PORT;

server.listen(port, () => {
  console.log("You are listening to port " + port);
});

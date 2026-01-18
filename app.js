const express = require("express");
const routes = require("./routes");
const createHttpError = require("http-errors");
const middlewares = require("./middlewares");
const { returnJson } = require("./my_modules/stander_respone");

global.returnJson = returnJson;
const app = express();
middlewares.globale(app);

process.on("unhandledRejection", (reason) => {
  console.log(reason);
  process.exit(12);
});

routes(app);
/**
 * Not Found Handler
 */
app.use((req, res, next) => {
  const error = createHttpError(404);
  next(error);
});

/**
 * Error Handler
 */
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode).json({ status: false, message: error.message });
  global.returnJson(res, error.statusCode, false, error.message, null);
});
module.exports = app;

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const compression = require("compression");
const hpp = require("hpp");

module.exports = {
  globale: (app) => {
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        optionsSuccessStatus: 200,
      }),
    );
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
    });
    app.use(limiter);
    app.use(helmet());
    app.use(hpp());
    app.use(express.json({ limit: "10kb" })); // Adjust limit as needed
    app.use((req, res, next) => {
      Object.defineProperty(req, "query", {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next();
    });
    app.use(mongoSanitize());
    app.use(compression());
  },
  auth: require("./auth"),
};

const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.info("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(cors());
// app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));
const tinyMorganWithBody =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(morgan(tinyMorganWithBody));

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;

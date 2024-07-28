require("dotenv").config();
const express = require("express");
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.info("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
const tinyMorganWithBody =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(morgan(tinyMorganWithBody));

app.use("/api/blogs", blogsRouter);

app.listen(process.env.PORT, () => {
  console.info(`Server running in port ${process.env.PORT}`);
});

module.exports = app;

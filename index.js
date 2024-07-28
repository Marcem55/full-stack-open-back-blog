const app = require("./app");

app.get("/", (req, res, next) => {
  res.status(200).send("<h1>Hello BlogApp!</h1>");
});

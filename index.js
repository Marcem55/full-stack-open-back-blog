const config = require("./utils/config");
const app = require("./app");

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello BlogApp!</h1>");
});

app.listen(config.PORT, () => {
  console.info(`Server running in port ${config.PORT}`);
});

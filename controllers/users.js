const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const userNameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*?&-_]{10,}$/;

  if (!userNameRegex.test(username)) {
    res.status(400).json({ message: "Username with invalid characters" });
  } else if (!passwordRegex.test(password)) {
    res.status(400).json({ message: "The password is too weak" });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  }
});

usersRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

module.exports = usersRouter;

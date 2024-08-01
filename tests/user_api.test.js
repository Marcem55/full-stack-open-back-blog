const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("--- POST users ---", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("seKrEt!55%full-", 10);
    const user = new User({ username: "root", name: "root", passwordHash });
    await user.save();
  });

  test("creation fails with invalid username or password", async () => {
    const usersBefore = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const newUser = {
      username: "mlu",
      name: "Matti Luukkainen",
      password: "sa*lAid$566-nen",
    };
    const newUser2 = {
      username: "mlu-ds$",
      name: "Matti Luukkainen",
      password: "sa*lAid$566-nen",
    };
    const newUser3 = {
      username: "mluukkas",
      name: "Matti Luukkainen",
      password: "sa*laid$566-nen",
    };

    await api.post("/api/users").send(newUser).expect(400);
    await api.post("/api/users").send(newUser2).expect(400);
    await api.post("/api/users").send(newUser3).expect(400);

    const usersAfter = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(usersAfter.body.length, usersBefore.body.length);

    const usernames = usersAfter.body.map((u) => u.username);
    assert(!usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});

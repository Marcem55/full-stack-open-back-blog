const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    author: "Marcelo Malacalza",
    title: "Cómo comenzar a correr, todo sobre el running",
    url: "https://www.runnersworld.com/es/training/a31334281/como-empezar-correr-running/",
    votes: 0,
  },
  {
    author: "Marcelo Malacalza",
    title: "Para comenzar a programar, no hay que procrastinar!",
    url: "https://doodle.com/es/how-to-overcome-procrastination-with-scheduling/",
    votes: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});

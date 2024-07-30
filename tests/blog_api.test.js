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
    likes: 0,
  },
  {
    author: "Marcelo Malacalza",
    title: "Para comenzar a programar, no hay que procrastinar!",
    url: "https://doodle.com/es/how-to-overcome-procrastination-with-scheduling/",
    likes: 0,
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

test("should have id, not _id", async () => {
  const response = await api.get("/api/blogs");
  const blogKeys = Object.keys(response.body[0]);
  assert.strictEqual(blogKeys.includes("id"), true);
  assert.strictEqual(!blogKeys.includes("_id"), true);
});

test("can create a blog", async () => {
  const newBlog = {
    author: "Franco Malacalza",
    title: "Como viciar en cada juego que veas sin fallar",
    url: "https://vicio.com/es/viciar-es-para-franquito/",
    likes: 45,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length + 1);
  delete response.body[response.body.length - 1].id;

  assert.deepStrictEqual(response.body[response.body.length - 1], newBlog);
});

after(async () => {
  await mongoose.connection.close();
});

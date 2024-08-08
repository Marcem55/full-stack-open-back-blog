const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const Blog = require("../models/blog");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");

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

const generateToken = async () => {
  await api.post("/api/users").send({
    username: "franquito",
    name: "Franco Malacalza",
    password: "password14$FF",
  });

  const tokenResponse = await api.post("/api/login").send({
    username: "franquito",
    password: "password14$FF",
  });

  return tokenResponse.body.token;
};

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("GET tests", () => {
  test("blogs are returned as json", async () => {
    const token = await generateToken();

    await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should have id, not _id", async () => {
    const token = await generateToken();

    const response = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const blogKeys = Object.keys(response.body[0]);
    assert.strictEqual(blogKeys.includes("id"), true);
    assert.strictEqual(!blogKeys.includes("_id"), true);
  });
});

describe("POST tests", () => {
  test("there are two blogs", async () => {
    const token = await generateToken();

    const response = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` });

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("can create a blog and save the user", async () => {
    const token = await generateToken();
    const decodedToken = jwt.verify(token, config.SECRET_KEY);

    const newBlog = {
      author: "Franco Malacalza",
      title: "Como viciar en cada juego que veas sin fallar",
      url: "https://vicio.com/es/viciar-es-para-franquito/",
      likes: 45,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` });
    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    delete response.body[response.body.length - 1].id;

    assert.deepStrictEqual(response.body[response.body.length - 1], {
      ...newBlog,
      user: {
        username: decodedToken.username,
        id: decodedToken.id,
        name: "Franco Malacalza",
      },
    });
    assert.strictEqual(
      response.body[response.body.length - 1].user.id,
      decodedToken.id
    );
  });

  test("create a blog without property likes", async () => {
    const token = await generateToken();

    const newBlog = {
      author: "Julieta Malacalza",
      title: "Aprendiendo python desde 0 para el rubro financiero",
      url: "https://financeJulieta.com/es/aprender-python-en-finanzas/",
    };

    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` });

    assert.strictEqual(response.body[response.body.length - 1].likes, 0);
  });

  test("cannot create without url or title", async () => {
    const token = await generateToken();

    const blogWithoutUrl = {
      author: "Marcelo Malacalza",
      likes: 18,
      title: "El mejor blog para hacer testing!",
    };

    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${token}` })
      .send(blogWithoutUrl)
      .expect(400);

    const blogWithoutTitle = {
      author: "Marcelo Malacalza",
      likes: 15,
      url: "https://testing.com/es/hacer-testing-mejora-tu-codigo/",
    };

    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${token}` })
      .send(blogWithoutTitle)
      .expect(400);
  });

  test("cannot create a blog without or with invalid token", async () => {
    const token = await generateToken();

    const newBlog = {
      author: "Franco Malacalza",
      title: "Como viciar en cada juego que veas sin fallar",
      url: "https://vicio.com/es/viciar-es-para-franquito/",
      likes: 45,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    await api
      .post("/api/blogs")
      .set({ authorization: "invalid token" })
      .send(newBlog)
      .expect(401);

    const response = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` });
    assert.strictEqual(response.body.length, initialBlogs.length);
  });
});

describe("DELETE tests", () => {
  test("delete a blog works", async () => {
    const token = await generateToken();

    const newBlog = {
      author: "Franco Malacalza",
      title: "Como viciar en cada juego que veas sin fallar",
      url: "https://vicio.com/es/viciar-es-para-franquito/",
      likes: 45,
    };

    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(201);

    const blogsBefore = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` });

    const blogToDelete = blogsBefore.body[blogsBefore.body.length - 1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(204);

    const blogsAfter = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` });

    const blogsTitles = blogsAfter.body.map((blog) => blog.title);
    assert(!blogsTitles.includes(blogToDelete.title));

    assert.strictEqual(blogsAfter.body.length, initialBlogs.length);
  });
});

describe("PUT tests", () => {
  test("update blog likes", async () => {
    const token = await generateToken();

    const blogs = await api
      .get("/api/blogs")
      .set({ authorization: `Bearer ${token}` });
    const blogToUpdate = blogs.body[0];
    const newBlog = {
      ...blogToUpdate,
      likes: 5,
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set({ authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(200);

    const updatedBlog = await api
      .get(`/api/blogs/${blogToUpdate.id}`)
      .set({ authorization: `Bearer ${token}` });
    assert.deepStrictEqual(updatedBlog.body, newBlog);
  });
});

after(async () => {
  await mongoose.connection.close();
});

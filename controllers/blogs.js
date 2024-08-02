const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.post("/", async (req, res) => {
  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  const users = await User.find({});

  const blog = new Blog({ ...req.body, user: users[0].id });
  const savedBlog = await blog.save();
  users[0].blogs = users[0].blogs.concat(savedBlog._id);
  await users[0].save();
  res.status(201).json(savedBlog);
});

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  if (blogs.length) {
    res.status(200).json(blogs);
  } else {
    res.status(400).json({ message: "No blogs founded" });
  }
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404).end();
  } else {
    res.status(200).json(blog);
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);

  if (!blog) {
    res.status(400).json({ message: "Blog not founded" });
  } else {
    const newBlog = {
      ...blog.toObject(), // to object para poder acceder a los valores y no a la referencia
      likes: req.body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, {
      new: true,
      runValidators: true,
      context: "query",
    });
    res.status(200).json(updatedBlog);
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(400).json({ message: "Blog already deleted from the database" });
  } else {
    const deletedResult = await Blog.findByIdAndDelete(id);
    console.info("Deleted result:", deletedResult);
    res.status(204).end();
  }
});

module.exports = blogsRouter;

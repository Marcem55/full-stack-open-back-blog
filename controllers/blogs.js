const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.post("/", async (req, res) => {
  if (Object.keys(req.body).length < 3) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  const blog = new Blog(req.body);
  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
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

module.exports = blogsRouter;

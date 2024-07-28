const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.post("/", (req, res, next) => {
  if (Object.keys(req.body).length < 3) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  const blog = new Blog(req.body);
  blog
    .save()
    .then((savedBlog) => {
      res.status(201).json(savedBlog);
    })
    .catch((error) => {
      console.log(error);
      next();
    });
});

blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    if (blogs.length) {
      res.status(200).json(blogs);
    } else {
      res.status(400).json({ message: "No blogs founded" });
    }
  });
});

blogsRouter.get("/:id", (req, res, next) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      if (!blog) {
        res.status(404).end();
      } else {
        res.status(200).json(blog);
      }
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;

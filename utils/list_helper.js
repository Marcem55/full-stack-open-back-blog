const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) return "No blogs";
  if (blogs.length === 1) {
    return {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes,
    };
  }

  let favoriteBlog = blogs[0];
  blogs.forEach((blog) => {
    if (blog.likes > favoriteBlog.likes) {
      favoriteBlog = blog;
    }
  });
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

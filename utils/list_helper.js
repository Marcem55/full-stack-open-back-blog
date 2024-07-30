const _ = require("lodash");

const dummy = () => {
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

const mostBlogs = (blogs) => {
  if (!blogs.length) return "No blogs";
  const authorBlogs = _.groupBy(blogs, "author");
  const authorBlogCounts = _.map(authorBlogs, (blogs, author) => {
    return {
      author,
      blogs: blogs.length,
    };
  });

  return _.maxBy(authorBlogCounts, "blogs");

  //* MY FIRST SOLUTION WITHOUT LODASH
  //   if (blogs.length === 1) {
  //     return {
  //       author: blogs[0].author,
  //       blogs: 1,
  //     };
  //   }

  //   let authorBlogs = [];

  //   for (let i = 0; i < blogs.length; i++) {
  //     const foundedAuthor = authorBlogs.find(
  //       (authorB) => authorB.author === blogs[i].author
  //     );
  //     if (foundedAuthor) {
  //       foundedAuthor.blogs += 1;
  //     } else {
  //       authorBlogs.push({
  //         author: blogs[i].author,
  //         blogs: 1,
  //       });
  //     }
  //   }
  //   let mostBlogger = authorBlogs[0];
  //   authorBlogs.forEach((blogger) => {
  //     if (blogger.blogs > mostBlogger.blogs) {
  //       mostBlogger = blogger;
  //     }
  //   });
  //   return mostBlogger;
};

const mostLikes = (blogs) => {
  if (!blogs.length) return "No blogs";
  //   * MY FIRST SOLUTION WITHOUT LODASH
  //   if (blogs.length === 1) {
  //     return {
  //       author: blogs[0].author,
  //       likes: blogs[0].likes,
  //     };
  //   }

  //   let authorLikes = [];

  //   for (let i = 0; i < blogs.length; i++) {
  //     const foundedAuthor = authorLikes.find(
  //       (authorL) => authorL.author === blogs[i].author
  //     );
  //     if (foundedAuthor) {
  //       foundedAuthor.likes += blogs[i].likes;
  //     } else {
  //       authorLikes.push({
  //         author: blogs[i].author,
  //         likes: blogs[i].likes,
  //       });
  //     }
  //   }
  //   let mostLiked = authorLikes[0];
  //   authorLikes.forEach((blogger) => {
  //     if (blogger.likes > mostLiked.likes) {
  //       mostLiked = blogger;
  //     }
  //   });
  //   return mostLiked;

  const authorLikes = _.groupBy(blogs, "author");
  const authorLikeCounts = _.map(authorLikes, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, "likes"),
  }));

  return _.maxBy(authorLikeCounts, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

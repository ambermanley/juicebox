const express = require("express");
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const tags = await getAllTags();
  const { tagName } = req.params;
  try {
    const allPosts = await getPostsByTagName(tagName);
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
    const posts = allPosts.filter((post) => {
      return post.active || (req.user && post.author.id === req.user.id);
    });
    res.send({
      posts,
    });
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    console.log({ name, message });
  }
});

module.exports = tagsRouter;

const Blog = require("../models/blog.model");

getBlog = async (req, res, next) => {
  let blog;
  try {
    blog = await Blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: "cannot find blog" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blog = blog;
  next();
};

module.exports = getBlog;
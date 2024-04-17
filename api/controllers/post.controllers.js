import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const newPost = new Post({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const savePost = await newPost.save();
    return res.status(200).json(savePost);
  } catch (error) {
    next(error);
  }
};

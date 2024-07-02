import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment.")
      );
    }
    const newComment = new Comment({ content, postId, userId });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLike += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLike -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (req.user.id !== comment.userId) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    return res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  console.log(req.user.id, req.body.userId);
  if (req.user.id !== req.body.userId) {
    return next(
      errorHandler(403, "You are not allowed to create this comment.")
    );
  }
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    if (!deletedComment) {
      return next(errorHandler(404, "Comment not found!"));
    }
    return res.status(200).json("This comment has been deleted");
  } catch (error) {
    next(error);
  }
};

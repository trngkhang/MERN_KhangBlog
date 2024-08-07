import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getPostComments,
  likeComment,
} from "../controllers/comment.controllers.js";
const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomments/:postId", getPostComments);
router.put("/likecomment/:commentId", verifyToken, likeComment);
router.put("/editcomment/:commentId", verifyToken, editComment);
router.delete("/delete/:commentId", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getComments);

export default router;

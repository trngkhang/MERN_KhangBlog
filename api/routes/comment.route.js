import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controllers.js";
const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomments/:postId", getPostComments);
router.put("/likecomment/:commentId", verifyToken, likeComment);

export default router;

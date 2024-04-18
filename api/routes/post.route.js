import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { create, getPosts } from "../controllers/post.controllers.js";
const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/posts", getPosts);

export default router;

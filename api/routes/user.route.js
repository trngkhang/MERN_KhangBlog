import express from "express";
const router = express.Router();
import {  test } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import {
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";

router.get("/test", test);
//midleware: verifyToken thuc hien xu ly truoc ham goi router
//controoler: updateUser thuc hien sau khi goi rourter
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/getusers", verifyToken, getUsers);
router.get("/getuser/:userId", getUser);
export default router;

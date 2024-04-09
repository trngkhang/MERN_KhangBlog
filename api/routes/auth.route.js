import express from "express";
import {
  signup,
  signin,
  google,
  signout,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/signout", signout);

export default router;

import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    //errorHandler vois thong diep cu the
    return next(errorHandler(400, "ALl field are required"));
  } else {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      return res.json("Signin successful");
    } catch (error) {
      //error handle mac dinh
      return next(error);
    }
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password || email === "" || password === "") {
    console.log("1");
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid passwword"));
    }
    //tao token sau khi xac thuc thanh cong voiws id
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    //lai bo password bang destructuring
    //lay ra password va dat ten la pass, sudung ...rest de lay ra tatca cac thuoc tinh con lai
    //thuoc tinh _doc la du lieu tho(raw) cua mongoose docudent
    const { password: pass, ...rest } = validUser._doc;
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    console.log(7);
    next(error);
  }
};

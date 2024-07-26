const User = require("../models/user");
/* const Request = require('express');
const Response = require('express'); */
import { Request, Response } from "express";
import {
  comparePassword,
  hashPassword,
  isEmail,
  isPassword,
} from "../helpers/auth";
import exp from "constants";
const jwt = require("jsonwebtoken");

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    console.log("email", email);

    if (!isEmail(email)) {
      return res.status(400).json({ message: "Not exist email type" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password less than 6 characters" });
    }

    if (!isPassword(password)) {
      return res.status(401).json({
        message:
          "Password must be at least 8 characters, one uppercase, one lowercase, one number and one special character",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    /*   await user.save(); */

    return res.status(201).json({
      status: "OK",
      newUser,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({
        message: "Email or Password not provided",
      });
    }
    if (!isEmail(email)) {
      return res.status(401).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(401)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Login failed! User could not find" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is wrong" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    };

    res.status(201).cookie("token", token, cookieOptions).json({
      status: "OK",
      message: "User successfully logged in",
      user,
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now()),
    };

    res
      .status(200)
      .cookie("token", null, cookieOptions)
      .json({ message: "User successfully logged out" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred during logout", error: error });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { token } = req.body;

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (err: any, decodedToken: any) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "User could not finded" });
      }
      /* const user = await User.findById(decodedToken.id); */
      const user = await User.findOne({ email: decodedToken.email });
      if (user) {
        return res
          .status(200)
          .json({ status: "OK", message: "User finded", user });
      } else {
        return res.status(200).json({ message: "User could not finded" });
      }
    }
  );

  /*   if (user) {
    return res.status(200).json({ message: "User finded", user });
  } else {
    return res.status(200).json({ message: "User could not finded" });
  } */
};

/* module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
};
 */

export { registerUser, loginUser, logoutUser, getUser };

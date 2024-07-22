const User = require("../models/user");
/* const Request = require('express');
const Response = require('express'); */
import { Request, Response } from "express";
import { comparePassword, hashPassword, isEmail } from "../helpers/auth";
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

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password less than 6 characters" });
    }

    if (!isEmail(email)) {
      return res.status(400).json({ message: "Not exist email type" });
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
    const maxAge = 3 * 60 * 60;
    const token = await jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: maxAge,
      }
    );

    console.log("okeyy");
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });
    return res.status(201).json({
      status: "OK",
      newUser,
      token,
    });
    /*     const token = await user.generateAuthToken();
     */
  } catch (error) {
    res.status(400).send(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          message: "Email or Password not provided",
        });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      if (!isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Login failed! Check authentication credentials" });
      }
  
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Password is wrong" });
      }
  
      const maxAge = 3 * 60 * 60;
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: maxAge,
        }
      );
  
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // 3hrs in ms
      });
  
      res.status(200).json({ message: "User successfully logged in", user, token });
  
    } catch (error: any) {
      res.status(500).json({
        message: "An error occurred",
        error: error.message,
      });
    }
  };

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
    });
    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred during logout", error: error });
  }
};

const getUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(200).json({ message: "User finded", user });
  } else {
    return res.status(200).json({ message: "User could not finded" });
  }
};

/* module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
};
 */

export { registerUser, loginUser, logoutUser, getUser };
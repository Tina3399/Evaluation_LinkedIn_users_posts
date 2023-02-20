const express = require("express");
const bcrypt = require("bcrypt");
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");

// get All users

UserRouter.get("/", async (req, res) => {
  let users = await UserModel.find();
  res.send(users);
});

// Register New User

UserRouter.post("/register", async (req, res) => {
  const { name, email, gender, pass, age, city } = req.body;

  const checkUser = await UserModel.find({ email, name });

  if (checkUser.length === 0) {
    try {
      bcrypt.hash(pass, 5, async (error, hash) => {
        if (error) {
          res.send({ msg: "Something went wrong", error: error.message });
        } else {
          const user = new UserModel({
            name,
            email,
            gender,
            pass: hash,
            age,
            city,
          });
          await user.save();
          res.send({ msg: "New user has been registered successfully " });
        }
      });
    } catch (error) {
      res.send({ msg: "Something went wrong", error: error.message });
    }
  } else {
    res.send({ msg: "User already exist, please login" });
  }
});

// User login functionality

UserRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (error, result) => {
        if (result) {
          const token = jwt.sign({ userId: user[0]._id }, "masai");
          console.log(token);
          res.send({
            msg: "User Successfully logged in",
            token: token,
            email: email,
          });
        } else {
          res.send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.send("Not able to login ! Please check");
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = { UserRouter };

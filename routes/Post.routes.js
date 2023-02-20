const express = require("express");

const { PostModel } = require("../models/Posts.model");

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  const posts = await PostModel.find();
  console.log(posts);
  res.send(posts);
});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;

  try {
    const post = new PostModel(payload);
    await post.save();
    console.log(post);
    res.send(post);
  } catch (err) {
    res.send({ msg: "Something went wrong", err: err.message });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;

  try {
    await PostModel.findByIdAndUpdate({ _id: id }, payload);
    res.send({ msg: "Post Updated Successfully" });
  } catch (err) {
    res.send({ msg: "Something went wrong", err: err.message });
  }
});

postRouter.patch("/delete/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;

  try {
    await PostModel.findByIdAndDelete({ _id: id }, payload);
    res.send({ msg: "Post Updated Successfully" });
  } catch (err) {
    res.send({ msg: "Something went wrong", err: err.message });
  }
});

module.exports = { postRouter };

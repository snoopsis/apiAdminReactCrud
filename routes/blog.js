const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const moment = require("moment");

const marca = moment().format("DDMMYYhhmm");

const User = require("../models/User");
const Post = require("../models/Post");

// @route     GET api/blog
// @desc      Get all posts
// @access    Private
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({
      date: -1
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     GET api/blog
// @desc      Get all posts
// @access    Private
router.get("/:id", async (req, res) => {
  try {
    const posts = await Post.find({ _id: req.params.id });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/blog
// @desc      Add new post
// @access    Private
router.post(
  "/",
  [
    auth,
    [
      check("titulo", "Titulo e Obrigatorio!")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { titulo, cat, texto, ativo, file } = req.body;

    // const fileName = marca + "-" + (await file.slice(12, 500));
    const fileName = marca + ".jpg";

    try {
      const newPost = new Post({
        titulo,
        cat,
        texto,
        ativo: ativo === "TRUE" ? true : false,
        img: fileName
      });

      const post = await newPost.save();
      console.log(post);

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT api/posts/:id
// @desc      Update post
// @access    Private
router.put("/:id", auth, async (req, res) => {
  const { titulo, cat, texto, ativo, img } = req.body;

  // Build contact object
  const postFields = {};
  if (titulo) postFields.titulo = titulo;
  if (cat) postFields.cat = cat;
  if (texto) postFields.texto = texto;
  if (ativo) postFields.ativo = ativo;
  if (img) postFields.img = img;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "post not found" });

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/posts/:id
// @desc      Delete post
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "post not found" });

    await Post.findByIdAndRemove(req.params.id);

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

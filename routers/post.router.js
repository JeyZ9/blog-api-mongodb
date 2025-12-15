const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller.js")

router.post("", PostController.createPost);
router.get("", PostController.getAllPosts);
// router.get("/:id", PostController.getById);
// router.get("author/:id", PostController.getByAuthorId);
// router.put("/:id", PostController.updatePost);
// router.delete("/:id", PostController.deletePost);
module.exports = router;
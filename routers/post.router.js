const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller.js");
const authJwt = require("../middlewares/authJWT.middleware.js");
const {upload, uploadToFirebase} = require("../middlewares/file.middleware");

router.post("", authJwt.verifyToken, upload, uploadToFirebase, PostController.createPost);
router.get("", PostController.getAllPosts);
router.get("/:id", PostController.getById);
router.get("/author/:id", PostController.getByAuthorId);
router.put("/:id", authJwt.verifyToken, PostController.updatePost);
router.delete("/:id", authJwt.verifyToken, PostController.deletePost);
module.exports = router;
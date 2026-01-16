const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller.js");
const authJwt = require("../middlewares/authJWT.middleware.js");
// const { uploadToFirebase} = require("../middlewares/file.middleware");
const { upload, uploadToSupabase } = require("../middlewares/supabase.middleware.js");

router.post("", authJwt.verifyToken, upload, uploadToSupabase, PostController.createPost);
router.get("", PostController.getAllPosts);
router.get("/:id", PostController.getById);
router.get("/author/:id", PostController.getByAuthorId);
router.put("/:id", authJwt.verifyToken, upload, uploadToSupabase, PostController.updatePost);
router.delete("/:id", authJwt.verifyToken, PostController.deletePost);
module.exports = router;
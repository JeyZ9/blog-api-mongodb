const PostModel = require("../models/Post.js");
const UserModel = require("../models/User.js");

exports.createPost = async (req, res) => {
    const { title, summary, content, cover, authorId } = req.body;

    if(!title || !summary || !content || !cover || !authorId) {
        return res.status(400).send({
          message: "Please provide all fields.",
        });
    }

    try{

        const existedPost = await PostModel.findOne({title});
        if(existedPost) {
            return res.status(400).send({
                message: "Post title is already used."
            })
        }

        const author = await UserModel.findById({_id: authorId});
        if(!author){
            return res.status(400).send({
                message: "User not found.",
            });
        }

        const createPost = await PostModel.create({
            title,
            summary,
            content,
            cover,
            author
        });

        if(!createPost){
            return res.status(404).send({
              message: "Cannot create a new post.",
            });
        }

        res.send({
            message: "Create post successfully."
        });

    }catch(e) {
        res.status(500).send({
          message:
            e.message || "Something occurred while created a new post.",
        });
    }
}

exports.getAllPosts = async (req, res) => {
    try{
        const posts = await PostModel.find().populate("author", ["username"]).sort({createdAt: -1});

        if(!posts) {
            return res.status(404).send({
                message: "Post not found."
            });
        }

        res.send(posts);
    }catch(e) {
        res.status(500).send({
          message: e.message || "Something occurred while get all post.",
        });
    }
}
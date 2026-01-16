const PostModel = require("../models/Post.js");
const UserModel = require("../models/User.js");
const {deleteFromSupabaseByUrl} = require("../middlewares/supabase.middleware.js")


exports.createPost = async (req, res) => {
  if (!req.file || !req.file.supabaseUrl) {
    return res.status(400).json({
      message: "Cover image is required"
    });
  }
    const { title, summary, content } = req.body;
    const authorId = req.authorId;

    if(!title || !summary || !content) {
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
            cover: req.file.supabaseUrl,
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
        const posts = await PostModel.find()
        .populate("author", ["username"])
        .sort({createdAt: -1})
        .limit(20);

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

exports.getById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        message: "Post id is missing.",
      });
    }

    console.log(id);
    try{
        const post = await PostModel.findOne({_id: id})
        .populate("author", ["username"]);
        if(!post){
            return res.status(404).send({
                message: "Post not found."
            })
        }
        
        return res.send(post);
    } catch (e) {
        res.status(500).send({
          message: e.message || "Something occurred while get post by id.",
        });
    }
}

exports.getByAuthorId = async (req, res) => {
    const { id } = req.params;
    if(!id) {
        return res.status(404).send({
          message: "Author id is missing.",
        });
    }
    try {
      const author = await UserModel.findById({ _id: id });
      if (!author) {
        return res.status(404).send({
          message: "author not found.",
        });
      }

      const post = await PostModel.find({ author })
        .sort({ createdAt: -1 })
        .limit(20);

      return res.send(post);
    } catch (e) {
      res.status(500).send({
        message: e.message || "Something occurred while get post by author id.",
      });
    }
}

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, summary, content } = req.body;
  const authorId = req.authorId;

  if (!id) {
    return res.status(404).send({ message: "Post id is missing." });
  }

  if (!authorId) {
    return res.status(401).send({ message: "Author id is missing." });
  }

  if (!title || !summary || !content) {
    return res.status(400).send({ message: "Please provide all fields." });
  }

  try {
    const post = await PostModel.findOne({
      _id: id,
      author: authorId,
    });

    if (!post) {
      return res.status(404).send({
        message: "Post not found or unauthorized.",
      });
    }

    post.title = title;
    post.summary = summary;
    post.content = content;

    if (req.file.supabaseUrl) {
      if (post.cover) {
        await deleteFromSupabaseByUrl(post.cover);
      }

      post.cover = req.file.supabaseUrl;
    }

    await post.save();

    res.send({
      message: "Update post successfully.",
    });
  } catch (e) {
    res.status(500).send({
      message: e.message || "Something occurred while update post.",
    });
  }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const authorId = req.authorId;

    if (!id) {
      return res.status(404).send({
        message: "Post id is missing.",
      });
    }

    try {
        const deleted = await PostModel.deleteOne({_id: id, author: authorId});
        
        if(deleted.deletedCount === 0) {
            return res.status(400).send({
              message: "Delete post fail.",
            });
        }

        res.send({
          message: "Delete post successfully.",
        });
    } catch (e) {
      res.status(500).send({
        message: e.message || "Something occurred while delete post.",
      });
    }
}
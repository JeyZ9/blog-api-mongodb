// "main": "index.js", จะทำงานตอนที่เรา deploy โดยโปรแกรมอันโนมัติจะมาดูไฟล์ที่ main และไปค้นหาไฟล์

const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const FRONT_END_URL = process.env.FRONT_END_URL;
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const UserRouter = require("./routers/user.router.js");
const PostRouter = require("./routers/post.router.js");
const multer = require("multer");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const upload = multer({ storage: multer.memoryStorage() });
// app.use(upload)
app.use(
  cors({
    origin: [FRONT_END_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

// Connect to database
if (!DB_URL) {
  console.error("DB_URL is missing. Please set it in your .env file.");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Connected to mongodb successfully.");
    })
    .catch((e) => {
      console.error("Mongodb connection error", e.message);
    });
}

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/posts", PostRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

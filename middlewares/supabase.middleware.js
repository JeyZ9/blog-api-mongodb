const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("file");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extName = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

const supabase = require("../config/supabase.config");

async function uploadToSupabase(req, res, next) {
  if (!req.file) {
    next();
    return;
  }

  try {
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("blog-cover") // ชื่อ bucket
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    // public url
    const { data } = supabase.storage
      .from("blog-cover")
      .getPublicUrl(filePath);

    req.file.supabaseUrl = data.publicUrl;
    next();

  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong while uploading to Supabase."
    });
  }
}

module.exports = {
  upload,
  uploadToSupabase
};

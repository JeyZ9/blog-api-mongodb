const molter = require("multer");
const path = require("path");

const firebaseConfig = require("../config/firebase.config");
const {getStorage, ref, uploadBytesResumable, getDownloadURL} = require("firebase/storeage");

const {initializeApp} = require("firebase/app");
const multer = require("multer");

//  Initialize firebase storage
const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

// set storage engin
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single("file");

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extName) {
        return cb(null, true);
    }else {
        cb("Error image only!!")
    }
}

// upload to firebase
async function uploadToFirebase(req, res, next) {
    if(!req.file){
        next();
        return;
    }

    //save location
    const storageRef = ref(firebaseStorage, `uploads/${req.file.originalname}`);
    const metadata = {
        contentType: req.file.mimetype
    }

    try{
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        // get url from firebase
        req.file.firebaseUrl = await getDownloadURL(snapshot.ref);
        next();
    }catch(error) {
        res.status(500).json({message: error.message || "Something went wrong while uploading to firebase."})
    }
}

module.exports = {upload, uploadToFirebase}
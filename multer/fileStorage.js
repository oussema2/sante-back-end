const multer = require("multer");
const path = require("path");

exports.fileStorage = multer.diskStorage({
  destination: "doctorImages",
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
  },
});

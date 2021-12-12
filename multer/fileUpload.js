const multer = require("multer");
const storageFile = require("./fileStorage").fileStorage;

exports.uploadFile = multer({
  storage: storageFile,
});

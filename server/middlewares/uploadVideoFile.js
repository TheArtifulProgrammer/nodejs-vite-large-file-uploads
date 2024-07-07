const multer = require("multer");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload.single("video"); 

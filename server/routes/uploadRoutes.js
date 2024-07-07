const express = require("express");
const route = express.Router();
const uploadVideoFile = require("../middlewares/uploadVideoFile");
const uploadVideo = require("../middlewares/uploadVideo");
const uploadController = require("../controllers/uploadController");

route.post(
  "/api/v1/upload",
  uploadVideoFile,
  uploadVideo,
  uploadController.uploadVideo
);

module.exports = route;

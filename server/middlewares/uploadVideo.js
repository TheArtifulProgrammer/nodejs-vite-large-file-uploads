const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB in bytes

module.exports = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded." });
  }

  const { chunkNumber, totalChunks, originalname } = req.body;

  if (!chunkNumber || !totalChunks || !originalname) {
    return res.status(400).json({ msg: "Missing chunk information." });
  }

  // Check total file size
  const chunkSize = req.file.size;
  const totalSize = chunkSize * totalChunks;
  if (totalSize > MAX_FILE_SIZE) {
    return res.status(400).json({ msg: "File size exceeds the limit of 1GB." });
  }
  // Success
  next();
};

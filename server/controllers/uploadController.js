const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const appendFileAsync = promisify(fs.appendFile);
const unlinkAsync = promisify(fs.unlink);
const readFileAsync = promisify(fs.readFile);

const uploadController = {
  uploadVideo: async (req, res) => {
    try {
      const { chunkNumber, totalChunks, originalname, title, description } =
        req.body;
      const tempDir = path.join(__dirname, "../uploads/temp");
      const uploadsDir = path.join(__dirname, "../uploads");

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      // Start uploading data chunks
      const chunkFile = req.file;
      const tempFilePath = path.join(tempDir, `${originalname}.part`);

      // Append the chunk to the temporary file
      await appendFileAsync(tempFilePath, chunkFile.buffer);
      console.log(
        `Chunk ${chunkNumber} of ${totalChunks} received for ${originalname}`
      );

      if (parseInt(chunkNumber) === parseInt(totalChunks) - 1) {
        // This is the last chunk, process the complete file
        let finalFilePath = path.join(uploadsDir, originalname);
        let fileNameWithoutExt = path.parse(originalname).name;
        let fileExt = path.parse(originalname).ext;
        let counter = 1;

        // Check if file already exists and rename if necessary
        while (fs.existsSync(finalFilePath)) {
          finalFilePath = path.join(
            uploadsDir,
            `${fileNameWithoutExt}_${counter}${fileExt}`
          );
          counter++;
        }

        // Read the entire temporary file
        const fileContent = await readFileAsync(tempFilePath);

        // Write the content to the final file
        await fs.promises.writeFile(finalFilePath, fileContent);

        // Delete the temporary file
        await unlinkAsync(tempFilePath);

        // Check MIME type
        const fileBuffer = await readFileAsync(finalFilePath);
        const { fileTypeFromBuffer } = await import("file-type");
        const fileType = await fileTypeFromBuffer(fileBuffer);

        if (fileType && fileType.mime.startsWith("video/")) {
          console.log(
            `Video ${originalname} uploaded successfully to ${finalFilePath}`
          );
          console.log(`MIME type: ${fileType.mime}`);

          // Here you would typically save the file information to your database
          // For example: await Video.create({ title, description, filePath: finalFilePath, mimeType: fileType.mime });

          res.status(200).json({
            title,
            description,
            msg: "Video uploaded successfully",
            filePath: finalFilePath,
            mimeType: fileType.mime,
          });
        } else {
          // If it's not a video file, delete it and send an error response
          await unlinkAsync(finalFilePath);
          throw new Error("Uploaded file is not a valid video.");
        }
      } else {
        // This is not the last chunk, acknowledge receipt
        res.status(200).json({
          msg: `Chunk ${chunkNumber} of ${totalChunks} received successfully`,
          currentChunk: chunkNumber,
          totalChunks: totalChunks,
        });
      }
    } catch (error) {
      console.error(`Error while uploading video: ${error.message}`);
      res
        .status(500)
        .json({ msg: "Error while uploading video", error: error.message });
    }
  },
};

module.exports = uploadController;

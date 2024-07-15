import { useState } from "react";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Progress from "./Progress";

const Input = styled("input")({
  display: "none",
});

const UploadButton = styled(Button)(() => ({
  backgroundColor: "#32CD32",
  color: "white",
  "&:hover": {
    backgroundColor: "#28a428",
  },
}));

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setError(null);
    setStatus("");
    setProgress(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const chunkSize = 2 * 1024 * 1024; // 2MB per chunk
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    const chunkProgress = 100 / totalChunks;
    let chunkNumber = 0;
    let start = 0;
    let end = chunkSize;

    const uploadNextChunk = async () => {
      if (chunkNumber < totalChunks) {
        const chunk = selectedFile.slice(start, end);
        const formData = new FormData();
        formData.append("video", chunk);
        formData.append("chunkNumber", chunkNumber);
        formData.append("totalChunks", totalChunks);
        formData.append("originalname", selectedFile.name);
        formData.append("title", title);
        formData.append("description", description);

        try {
          const response = await fetch("http://localhost:8000/api/v1/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.msg || `HTTP error! status: ${response.status}`
            );
          }

          console.log({ data });
          // NB : We are subtracting 1 from the progressInPercentage to account errors in the progress bar, ping me for explaination
          const progressInPercentage = Math.max(
            0,
            Math.round(Number((chunkNumber + 1) * chunkProgress)) - 1
          );
          const temp =
            progressInPercentage > 80
              ? `Uploading and validating file - ${progressInPercentage}% complete.`
              : `Uploading file - ${progressInPercentage}% complete.`;
          setStatus(temp);
          setProgress(progressInPercentage);
          console.log(temp);

          if (chunkNumber === totalChunks - 1) {
            // This is the last chunk
            // NB : We are subtracting 1 from the progressInPercentage to account errors in the progress bar, ping me for explaination
            setProgress(99);
            setStatus("File upload completed");
            return data;
          }

          chunkNumber++;
          start = end;
          end = Math.min(start + chunkSize, selectedFile.size);
          return await uploadNextChunk();
        } catch (error) {
          setError(`Error uploading : ${error.message}`);
          setStatus("File uploading failed.");
          setProgress(0);
          throw error; // Re-throw the error to stop the upload process
        }
      } else {
        setProgress(100);
        setSelectedFile(null);
        setStatus("File upload completed");
      }
    };

      try {
        const finalResponse = await uploadNextChunk();
        console.log("Final upload response:", finalResponse);
        if (finalResponse) {
          setStatus(finalResponse.msg);
          setProgress(100);
        }
      } catch (error) {
        setError(`Error uploading : ${error.message}`);
      }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" style={{color:"#32CD32"}} variant="h5">
          UPLOAD VIDEO IN CHUNKS
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            id="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="contained-button-file">
            <Input
              accept="video/*"
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mt: 2, mb: 2 }}
            >
              Select Video File
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
          {status && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              {status}
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {progress > 0 && <Progress value={progress} />}
          <UploadButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Upload
          </UploadButton>
        </Box>
      </Box>
    </Container>
  );
};

export default FileUpload;

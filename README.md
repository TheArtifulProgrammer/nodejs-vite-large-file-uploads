# Video Upload in Chunks

This project demonstrates a video upload system using React for the frontend and Node.js with Express for the backend. It allows users to upload large video files in chunks, improving upload speed and efficiency.

## Author

TheArtfulProgrammer

## Project Structure

project-root/
├── client/         # React + Vite frontend
└── server/         # Node.js + Express backend

## Features

- Upload large video files in chunks
- Improved upload speed
- In-memory chunk processing (instead of writing to disk)
- Uses Multer middleware for handling file uploads

## Credits

This project is an improvement on the code from [this Medium article](https://medium.com/@theyograjthakur/simplifying-large-file-uploads-with-react-and-node-js-a-step-by-step-guide-bd72967f57fe).

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Setting up the Server

1. Navigate to the server directory:

cd server

2. Install dependencies:

npm install

3. Start the server:

npm run dev

The server should now be running on `http://localhost:8000` (or your configured port).

### Setting up the Client

1. Navigate to the client directory:

cd client

1. Install dependencies:

npm install

3. Start the server:

npm run dev

The client should now be accessible at `http://localhost:5173` (or the port specified by Vite).

## Usage

1. Open the client application in your web browser.
2. Fill in the video title and description.
3. Select a video file to upload.
4. Click the "Upload" button to start the chunked upload process.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

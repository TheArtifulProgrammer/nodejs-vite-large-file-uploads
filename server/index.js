const uploadRoutes = require("./routes/uploadRoutes");

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const port = 8000;
app.use(cors());
// 
express.urlencoded({ extended: true });
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.json());
// routes
app.use(uploadRoutes);
// :
app.get("/", async (req, res) => {
  res.send("This is the way, aha!");
});
// :
app.listen(port, () => {
  console.log(`Server started and running on port ${port}`);
});

const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
var cors = require("cors");
var multer = require("multer");
const moment = require("moment");
const bodyParser = require("body-parser");

const marca = moment().format("DDMMYYhhmm");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Use middleware
app.use(cors());

// serve the react app files
app.use(express.static(`/home/snoopsis/nodeSites/backPortfolio/client/build`));

// BEGIN FILE HANDLE
// Create a multer instance and set the destination folder.
// The code below uses /public folder. You can also assign a
// new file name upon upload. The code below uses ‘originalfilename’as the file name.
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, "portfolio/client/public/images");
    cb(null, "/var/www/html/portfolioImagens");
  },
  filename: function(req, file, cb) {
    // cb(null, marca + "-" + file.originalname);
    cb(null, marca + ".jpg");
  }
});

// Create an upload instance and receive several files
var upload = multer({ storage: storage }).array("file");

// Setup thePOSTroute to upload a file
app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

//#END FILE HANDLE

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blog", require("./routes/blog"));

const PORT = process.env.PORT || 5019;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

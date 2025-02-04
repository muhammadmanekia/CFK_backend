const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController.js");
const multer = require("multer");

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" }); // Temp folder for files

// Route for file upload
router.post("/", upload.single("file"), uploadController.uploadFile);

module.exports = router;

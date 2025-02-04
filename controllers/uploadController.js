const multer = require("multer");
const fs = require("fs");
const { getBucket } = require("../config/firebase");

const upload = multer({ dest: "uploads/" });

const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const localFilePath = req.file.path;
  const firebaseFilePath = `uploads/${req.file.originalname}`;

  try {
    const bucket = getBucket();

    // Upload file to Firebase
    await bucket.upload(localFilePath, {
      destination: firebaseFilePath,
      metadata: { contentType: req.file.mimetype },
    });

    const [url] = await bucket.file(firebaseFilePath).getSignedUrl({
      action: "read",
      expires: "01-01-2030",
    });

    // Clean up local file after successful upload
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      } else {
        console.log("Local file deleted successfully");
      }
    });

    res.json({ message: "Upload successful", fileUrl: url });
  } catch (error) {
    console.error("Upload to Firebase failed:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

module.exports = { uploadFile };

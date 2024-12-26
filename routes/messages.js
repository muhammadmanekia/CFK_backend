const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Get all donations
router.get("/", messageController.getMessages);

// Create new donation
router.post("/", messageController.postMessages);

// Additional routes for updating and deleting donations
// ...

module.exports = router;

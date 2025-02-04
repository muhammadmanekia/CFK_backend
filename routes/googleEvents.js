const express = require("express");
const router = express.Router();
const eventController = require("../controllers/googleEventsController");
const googleOAuthManager = require("../controllers/googleOAuthManager");

// OAuth authentication route
router.get("/auth", (req, res) => {
  const authUrl = googleOAuthManager.generateAuthUrl();
  res.redirect(authUrl);
});

// OAuth callback route
router.get("/redirect", async (req, res) => {
  try {
    const code = req.query.code;
    await googleOAuthManager.exchangeCodeForTokens(code);
    res.redirect("/google"); // Redirect after successful authentication
  } catch (error) {
    res.status(500).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
});

// Fetch and save events
router.get("/fetch", eventController.fetchAndSaveEvents);

// Get all events
router.get("/", eventController.getAllEvents);

// Get specific event (note the ObjectId parameter)
router.get("/:id", eventController.getEventById);
module.exports = router;

const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Get all events
router.get("/", eventController.getAllEvents);

router.get("/upcoming", eventController.getUpcomingEvents);

// Create new event
router.post("/", eventController.createEvent);

// Get Islamic dates
router.get("/islamic-dates", eventController.getIslamicDates);

// Additional routes for updating and deleting events
// ...

module.exports = router;

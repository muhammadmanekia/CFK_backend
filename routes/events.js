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

// Update event
router.put("/:id", eventController.updateEvent);

router.delete("/:id", eventController.deleteEvent);
// ...

module.exports = router;

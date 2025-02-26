const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Get Islamic dates
router.get("/islamic-dates", eventController.getIslamicDates);
// Get all events
router.get("/", eventController.getAllEvents);

router.get("/upcoming", eventController.getUpcomingEvents);
router.get("/upcoming/new", eventController.getUpcomingEventsNew);

// Create new event
router.post("/", eventController.createEvent);

// Get a single event by ID
router.get("/:id", eventController.getEventById);

// Update event
router.put("/:id", eventController.updateEvent);

router.delete("/:id", eventController.deleteEvent);
// ...

module.exports = router;

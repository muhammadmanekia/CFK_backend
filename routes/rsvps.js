const express = require("express");
const router = express.Router();
const Rsvp = require("../models/Rsvp");

// Create a new RSVP
router.post("/", async (req, res) => {
  const { userID, event, name, email, numberOfGuests, additionalNotes } =
    req.body;

  try {
    const rsvp = new Rsvp({
      event,
      user: userID ? userID : null,
      name,
      email,
      numberOfGuests,
      additionalNotes,
    });

    const newRsvp = await rsvp.save();
    res.status(201).json({ message: "RSVP successfully submitted", newRsvp });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get RSVPs for a specific event
router.get("/:eventId", async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ event: req.params.eventId }).populate(
      "user",
      "username email"
    );
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get RSVPs for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ user: req.params.userId }).populate(
      "event"
    );
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Additional routes for updating and deleting RSVPs
// ...

module.exports = router;

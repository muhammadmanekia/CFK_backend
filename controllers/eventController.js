const { google } = require("googleapis");
const Event = require("../models/Event");
const IslamicDates = require("../models/IslamicDate");
require("dotenv").config();
const fs = require("fs");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get events from today onwards
exports.getUpcomingEvents = async (req, res) => {
  try {
    const datetoday = new Date(); // Get the current date and time
    const today = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago", // Central Time Zone
    }).format(datetoday);
    console.log(today);

    // Query MongoDB for events where the date is greater than or equal to today
    const events = await Event.find({
      date: { $gte: today },
    }).sort({
      date: 1,
    });

    console.log(events);
    res.json(events); // Send the events as the response
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Islamic dates
exports.getIslamicDates = async (req, res) => {
  try {
    const islamicDates = await IslamicDates.find();
    console.log(islamicDates);
    res.json(islamicDates);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  const { id } = req.params; // Get the event ID from the request parameters
  const updates = req.body; // Get the updated data from the request body

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent); // Send the updated event as the response
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Additional methods for updating and deleting events
// ...
// Delete event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params; // Get the event ID from the request parameters

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing code ...

// Get a single event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params; // Get the event ID from the request parameters

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event); // Send the event as the response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set up Google Calendar API
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// Function to get and store the token
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  // Implement logic to get the code from the user
  // Then call oAuth2Client.getToken(code, callback);
}

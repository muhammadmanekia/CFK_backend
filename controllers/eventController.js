const Event = require("../models/Event");
const IslamicDates = require("../models/IslamicDate");
require("dotenv").config();
const ScheduledNotification = require("../models/ScheduledNotification");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDateTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get events from today onwards
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date(); // Get the current date and time
    now.setHours(now.getHours() - 6); // Adjust to CST timezone
    console.log(now);

    // Get pagination parameters from the request query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Query MongoDB for events where the date is greater than or equal to now in CST
    const events = await Event.find({
      startDateTime: { $gte: now }, // Find events starting from now onward in CST
    })
      .sort({ startDateTime: 1 })
      .skip(skip) // Skip the number of items based on the page
      .limit(limit); // Limit the number of items returned

    const totalEvents = await Event.countDocuments({
      startDateTime: { $gte: now },
    }); // Get the total count of upcoming events

    const totalPages = Math.ceil(totalEvents / limit); // Calculate total pages

    console.log(events);
    res.json(
      events
      // totalPages,
      // currentPage: page,
      // totalEvents,
    ); // Send the events and pagination info as the response
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get events from today onwards
exports.getUpcomingEventsNew = async (req, res) => {
  try {
    const now = new Date(); // Get the current date and time
    now.setHours(now.getHours() - 6); // Adjust to CST timezone
    console.log(now);

    // Get pagination parameters from the request query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Query MongoDB for events where the date is greater than or equal to now in CST
    const events = await Event.find({
      startDateTime: { $gte: now }, // Find events starting from now onward in CST
    })
      .sort({ startDateTime: 1 })
      .skip(skip) // Skip the number of items based on the page
      .limit(limit); // Limit the number of items returned

    const totalEvents = await Event.countDocuments({
      startDateTime: { $gte: now },
    }); // Get the total count of upcoming events

    const totalPages = Math.ceil(totalEvents / limit); // Calculate total pages

    console.log(events);
    res.json({
      events,
      totalPages,
      currentPage: page,
      totalEvents,
    }); // Send the events and pagination info as the response
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
    console.log(error.message);
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
    const updatedEvent = await Event.findByIdAndUpdate(id, updates);
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
    await ScheduledNotification.findOneAndDelete({ eventId: id });

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

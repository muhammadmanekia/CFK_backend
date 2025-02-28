const mongoose = require("mongoose");
const ScheduledNotification = require("../models/ScheduledNotification");

exports.scheduleNotification = async (req, res) => {
  const { topic, title, body, screen, eventId, sendAt } = req.body;

  try {
    // Check if a scheduled notification for this event ID already exists
    let existingNotification;
    if (eventId != "null") {
      existingNotification = await ScheduledNotification.findOne({
        eventId,
      });
    }

    if (existingNotification) {
      // Update existing notification with new sendAt time and reset status
      existingNotification.sendAt = sendAt || new Date();
      existingNotification.status = "pending";
      existingNotification.title = title;
      existingNotification.body = body;
      existingNotification.screen = screen;
      existingNotification.topic = topic;
      await existingNotification.save();
    } else {
      // Create a new scheduled notification
      const newScheduledNotification = new ScheduledNotification({
        topic,
        title,
        body,
        screen,
        eventId: eventId && eventId !== "null" ? eventId : null,
        sendAt: sendAt || new Date(),
        createdAt: new Date(),
        status: "pending",
      });
      await newScheduledNotification.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Notification scheduled successfully." });
  } catch (error) {
    console.error("Error scheduling notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const deletedNotification = await ScheduledNotification.findOne({
      eventId: id,
    });

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification successfully deleted." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: error.message });
  }
};

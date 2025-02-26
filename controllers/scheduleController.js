const mongoose = require("mongoose");
const ScheduledNotification = require("../models/ScheduledNotification");

exports.scheduleNotification = async (req, res) => {
  const { topic, title, body, screen, eventId, sendAt } = req.body;

  try {
    // Check if a scheduled notification for this event ID already exists
    const existingNotification = await ScheduledNotification.findOne({
      eventId,
    });

    if (existingNotification) {
      // Update existing notification with new sendAt time and reset status
      existingNotification.sendAt = sendAt || new Date();
      existingNotification.status = "pending";
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

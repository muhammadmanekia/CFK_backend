const admin = require("firebase-admin");
const mongoose = require("mongoose");
const Notification = require("../models/Notifications");

exports.sendNotification = async (req, res) => {
  const { topic, title, body, screen, eventId } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    topic,
    data: {
      // Add the data payload
      eventId: eventId.toString(),
      click_action: "FLUTTER_NOTIFICATION_CLICK",
      targetScreen: screen || null, // Include the screen or null if not provided
    },
  };

  try {
    const response = await admin.messaging().send(message);
    const newNotification = new Notification({
      topic,
      title,
      body,
      screen,
      eventId,
    });
    await newNotification.save();
    res.status(200).json({ success: true, messageId: response }); // Send only the message ID
  } catch (error) {
    console.error("Error sending notification:", error); // Log the full error for debugging
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.find();
    if (!notification) {
      return res.status(404).json({ error: "No messages found." });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

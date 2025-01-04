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
      targetScreen: screen || "",
      eventId: eventId || "",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);

    // Save notification to database
    const newNotification = new Notification({
      topic,
      title,
      body,
      screen,
      eventId: eventId && eventId !== "null" ? eventId : null,
    });
    await newNotification.save();

    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending notification:", error);
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

const admin = require("firebase-admin");
const mongoose = require("mongoose");
const Notification = require("../models/Notifications");

exports.sendNotification = async (req, res) => {
  const { topic, title, body } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    topic,
  };

  try {
    const response = await admin.messaging().send(message);
    const newNotification = new Notification({
      topic,
      title,
      body,
    });
    await newNotification.save();
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
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

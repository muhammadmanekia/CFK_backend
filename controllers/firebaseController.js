const admin = require("firebase-admin");
const mongoose = require("mongoose");
const Notification = require("../models/Notifications");
const cron = require("node-cron");
const ScheduledNotification = require("../models/ScheduledNotification");

exports.sendNotification = async (req, res) => {
  const { topic, title, body, screen, eventId, sendAt } = req.body;

  try {
    // Check if a notification for this event id already exists
    const existingNotification = await Notification.findOne({
      eventId: eventId,
    });
    if (existingNotification) {
      // Update existing notification with new sendAt and status to pending
      existingNotification.sendAt = sendAt ? sendAt : new Date();
      existingNotification.status = "pending";
      await existingNotification.save();
    } else {
      // Save notification to database if it doesn't exist
      const newNotification = new Notification({
        topic,
        title,
        body,
        screen,
        eventId: eventId && eventId !== "null" ? eventId : null,
        sendAt: sendAt ? sendAt : new Date(),
        createdAt: new Date(),
        status: "pending", // Add a status field to track notification state
      });
      await newNotification.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error saving notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ sendAt: 1 });

    if (!notifications.length) {
      return res.status(404).json({ error: "No notifications found." });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

cron.schedule("* * * * *", async () => {
  console.log("Checking for scheduled notifications...");

  const now = new Date();

  try {
    const notificationsToSend = await ScheduledNotification.find({
      sendAt: { $lte: now },
      status: "pending",
    });

    if (!notificationsToSend.length) {
      console.log("No pending notifications to send.");
      return;
    }

    console.log(`Sending ${notificationsToSend.length} notifications...`);

    for (const notification of notificationsToSend) {
      try {
        // Delete the notification BEFORE sending
        await ScheduledNotification.findByIdAndDelete(notification._id);

        // Create FCM message
        const message = {
          notification: {
            title: notification.title,
            body: notification.body,
          },
          topic: notification.topic,
          data: {
            targetScreen: notification.screen || "",
            eventId: notification.eventId
              ? notification.eventId.toString()
              : "",
          },
        };

        // Send notification via Firebase
        await admin.messaging().send(message);
        console.log(`Notification sent for event ${notification.eventId}`);

        // Move the notification to the Notifications collection
        await Notification.create({
          topic: notification.topic,
          title: notification.title,
          body: notification.body,
          screen: notification.screen,
          eventId: notification.eventId,
          sendAt: notification.sendAt,
          createdAt: new Date(),
          status: "sent",
        });
      } catch (error) {
        console.error(`Error sending notification ${notification._id}:`, error);
        await ScheduledNotification.findByIdAndUpdate(notification._id, {
          status: "failed",
        });
      }
    }

    console.log("Finished processing scheduled notifications.");
  } catch (error) {
    console.error("Error in notification cron job:", error);
  }
});

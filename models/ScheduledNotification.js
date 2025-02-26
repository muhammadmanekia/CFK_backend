const mongoose = require("mongoose");

const scheduledNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    topic: {
      type: String,
    },
    screen: {
      type: String,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: false,
    },
    sendAt: { type: Date },
    status: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ScheduledNotification",
  scheduledNotificationSchema,
  "Scheduled_Notification"
);

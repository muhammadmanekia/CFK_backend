const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    location: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: String,
    },
    organizers: {
      type: String,
    },
    registrationLink: {
      type: String,
    },
    contact: {
      type: String,
    },
    requireRSVP: {
      type: Boolean,
      default: false,
    },
    audience: {
      type: String,
    },
    googleId: {
      type: String,
    },
    startDateTime: {
      type: Date,
    },
    endDateTime: {
      type: Date,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema, "events");

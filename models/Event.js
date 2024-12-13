const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    location: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);

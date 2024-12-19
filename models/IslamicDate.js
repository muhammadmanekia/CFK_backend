const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
});

const islamicDateSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    events: [eventSchema], // Array of events for each month
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "IslamicDates",
  islamicDateSchema,
  "islamicDates"
);

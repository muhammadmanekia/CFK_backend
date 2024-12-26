const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  url: {
    type: String,
  },
  mediaType: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Messages", messageSchema, "messages");

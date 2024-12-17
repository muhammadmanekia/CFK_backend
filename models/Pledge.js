const mongoose = require("mongoose");

const pledgeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["ONE_TIME", "MONTHLY", "YEARLY"],
      default: "ONE_TIME",
    },
    pledgerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pledgerName: {
      type: String,
      required: true,
    },
    pledgerEmail: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pledge", pledgeSchema, "pledges");

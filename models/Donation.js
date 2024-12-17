const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentMethod: {
      type: String,
      enum: ["APPLE_PAY", "GOOGLE_PAY"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    donorName: {
      type: String,
    },
    donorEmail: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema, "donations");

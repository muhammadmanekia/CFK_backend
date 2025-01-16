const mongoose = require("mongoose");

const membershipsSchema = new mongoose.Schema({
  startDate: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  spouseFirstName: { type: String },
  spouseLastName: { type: String },
  spousePhoneNumber: { type: String },
  spouseEmail: { type: String },
  mailingAddress: { type: String },
  membershipType: { type: String },
  isVotingMember: { type: Boolean },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Memberships",
  membershipsSchema,
  "memberships"
);

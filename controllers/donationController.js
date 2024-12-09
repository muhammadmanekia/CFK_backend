const Donation = require("../models/Donation");

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new donation
exports.createDonation = async (req, res) => {
  const donation = new Donation(req.body);
  try {
    const newDonation = await donation.save();
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Additional methods for updating and deleting donations
// ...

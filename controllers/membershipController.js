const Memberships = require("../models/Memberships");

// Get all donations
exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Memberships.find();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new donation
exports.createMemberships = async (req, res) => {
  console.log(req.body);
  const memberships = new Memberships(req.body);
  try {
    const newMemberships = await memberships.save();
    res.status(201).json(newMemberships);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Pledge = require("../models/Pledge");

// Get all pledges
exports.getAllPledges = async (req, res) => {
  try {
    const pledges = await Pledge.find();
    res.json(pledges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new pledge
exports.createPledge = async (req, res) => {
  const { amount, pledgerEmail, pledgerName, pledgerId } = req.body;
  console.log(amount, pledgerEmail, pledgerName, pledgerId);
  try {
    const newPledge = new Pledge({
      amount,
      pledgerEmail,
      pledgerName,
      pledgerId,
    });

    await newPledge.save();
    res.status(201).json(newPledge);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Additional methods for updating and deleting pledges
// ...

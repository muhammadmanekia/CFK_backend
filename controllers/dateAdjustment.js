const express = require("express");
const router = express.Router();
const Adjustment = require("../models/Adjustment"); // MongoDB model

// Save or update the adjustment
router.post("/save-adjustment", async (req, res) => {
  const { adjustment } = req.body;
  try {
    const result = await Adjustment.findOneAndUpdate(
      { key: "dateAdjustment" },
      { value: adjustment },
      { upsert: true, new: true }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to save adjustment" });
  }
});

// Retrieve the adjustment
router.get("/get-adjustment", async (req, res) => {
  try {
    const adjustment = await Adjustment.find({ key: "dateAdjustment" });
    console.log(adjustment);
    res.status(200).json(adjustment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch adjustment" });
  }
});

module.exports = router;

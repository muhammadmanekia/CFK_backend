const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");

// Get all donations
router.get("/", donationController.getAllDonations);

// Create new donation
router.post("/", donationController.createDonation);

// Additional routes for updating and deleting donations
// ...

module.exports = router;

const express = require("express");
const router = express.Router();
const pledgeController = require("../controllers/pledgeController");

// Get all pledges
router.get("/", pledgeController.getAllPledges);

// Create new pledge
router.post("/", pledgeController.createPledge);

// Additional routes for updating and deleting pledges
// ...

module.exports = router;

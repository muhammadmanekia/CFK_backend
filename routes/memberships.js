const express = require("express");
const router = express.Router();
const membershipsController = require("../controllers/membershipController");

// Get all donations
router.get("/", membershipsController.getAllMemberships);

// Create new donation
router.post("/", membershipsController.createMemberships);

// Additional routes for updating and deleting donations
// ...

module.exports = router;

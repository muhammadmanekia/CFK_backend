const express = require("express");
const router = express.Router();
const firebaseController = require("../controllers/firebaseController");

router.post("/send-notification", firebaseController.sendNotification);

module.exports = router;

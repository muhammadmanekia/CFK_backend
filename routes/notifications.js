const express = require("express");
const router = express.Router();
const firebaseController = require("../controllers/firebaseController");

router.post("/send-notification", firebaseController.sendNotification);
router.get("/get-notifications", firebaseController.getNotification);

module.exports = router;

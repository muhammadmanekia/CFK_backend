const express = require("express");
const router = express.Router();
const firebaseController = require("../controllers/firebaseController");
const ScheduleController = require("../controllers/scheduleController");

router.post("/send-notification", ScheduleController.scheduleNotification);
router.get("/get-notifications", firebaseController.getNotifications);
router.delete(
  "/delete-notification/:id",
  firebaseController.deleteNotification
);

router.delete("/delete-schedule/:id", ScheduleController.deleteNotification);

module.exports = router;

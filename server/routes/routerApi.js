const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  challengeActivity,
  calorieBurnedFromActivity,
  completedActivity,
  notificationHabit,
} = require("../controllers/controllerApi");

router.get("/activity", authentication, challengeActivity);
router.get("/calorie-burned", authentication, calorieBurnedFromActivity);
router.get("/completedActivity", authentication, completedActivity);
router.get("/notification", authentication, notificationHabit);

module.exports = router;

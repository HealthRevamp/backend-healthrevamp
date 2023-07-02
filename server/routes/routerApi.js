const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  challengeActivity,
  calorieBurnedFromActivity,
  completedActivity,
  notificationHabit,
  paymentStripe, 
  sendMail
} = require("../controllers/controllerApi");

router.get("/activity", authentication, challengeActivity);
router.get("/calorie-burned", authentication, calorieBurnedFromActivity);
router.get("/completedActivity", authentication, completedActivity);
router.get("/notification", authentication, notificationHabit);
router.post("/payment", authentication, paymentStripe);
router.post("/mail", authentication, sendMail);


module.exports = router;

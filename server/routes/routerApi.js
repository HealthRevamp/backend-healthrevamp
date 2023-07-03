const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  challengeActivity,
  getActivityById,
  completedActivity,
  notificationHabit,
  paymentStripe,
  sendMail,
  foodNutrition,
} = require("../controllers/controllerApi");

router.get("/activity", authentication, challengeActivity);
router.get("/activity/:id", authentication, getActivityById);
router.get("/completedActivity", authentication, completedActivity);
router.get("/notification", authentication, notificationHabit);
router.post("/payment", authentication, paymentStripe);
router.post("/mail", authentication, sendMail);
router.post("/food-nutrition", authentication, foodNutrition);

module.exports = router;

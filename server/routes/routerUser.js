const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  userRegister,
  userLogin,
  updateProfile,
  updateSubscribe,
  updateTotalCalorie,
  rangkingCalorie,
} = require("../controllers/controllerUser");

router.post("/register", userRegister);
router.post("/login", userLogin);

router.put("/update", authentication, updateProfile);
router.patch("/updateSub", authentication, updateSubscribe);
router.patch("/updateCal", authentication, updateTotalCalorie);
router.get("/ranking", authentication, rangkingCalorie);

module.exports = router;

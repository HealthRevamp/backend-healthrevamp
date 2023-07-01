const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const {
  getHabits,
  addHabits,
  deleteHabits,
} = require("../controllers/controllerHabit");

router.get("/", authentication, getHabits);
router.post("/", authentication, addHabits);
router.delete("/:id", authentication, deleteHabits);

module.exports = router;

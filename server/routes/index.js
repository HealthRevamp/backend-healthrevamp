const express = require("express");
const router = express.Router();

const user = require("./routerUser");
const payment = require("./routerApi");
const habit = require("./habit");
router.use("/users", user);
router.use("/api", payment);
router.use("/habits", habit);

module.exports = router;

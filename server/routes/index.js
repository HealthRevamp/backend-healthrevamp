const express = require("express");
const router = express.Router();

const user = require("./routerUser");
const payment = require("./routerApi");
router.use("/users", user);
router.use("/api", payment);

module.exports = router;

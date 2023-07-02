const express = require("express");
const router = express.Router();

const user = require("./routerUser");
const ALog = require("./routerALog");
const api = require("./routerApi");

router.use("/users", user);
router.use("/activity-log", ALog);
router.use("/api", api);

module.exports = router;

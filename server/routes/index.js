const express = require("express");
const router = express.Router();

const user = require("./routerUser");

router.use("/users", user);

module.exports = router;

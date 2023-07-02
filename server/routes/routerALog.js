const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { createActivityLog } = require("../controllers/controllerActivityLog");

router.post("/createALog", authentication, createActivityLog);

module.exports = router;

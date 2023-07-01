const express = require("express");
const authentication = require("../middlewares/authentication");
const { paymentStripe } = require("../controllers/controllerApi");
const router = express.Router();

router.post("/payment", authentication, paymentStripe);

module.exports = router;

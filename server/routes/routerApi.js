const express = require("express");
const authentication = require("../middlewares/authentication");
const { paymentStripe } = require("../controllers/controllerApi");
const router = express.Router();

router.post("/payment", paymentStripe);

module.exports = router;

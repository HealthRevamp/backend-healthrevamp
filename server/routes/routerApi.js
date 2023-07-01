const express = require("express");
const authentication = require("../middlewares/authentication");
const { paymentStripe, sendMail } = require("../controllers/controllerApi");
const router = express.Router();

router.post("/payment", authentication, paymentStripe);
router.post("/mail", authentication, sendMail);

module.exports = router;

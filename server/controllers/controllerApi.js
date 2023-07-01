const calculatePrice = require("../helpers/subscribePayment");
const stripe = require("stripe")(
  "sk_test_51NOe6GF6N9Yr0jswgafC8DZOrHAPhzN3IA4cYq3ou71t6EjaODyFDdDa51u7SQajSHhAdZ9D1S52KFoOBqUweIuA00cxxriVxp"
);
const axios = require("axios");
class ControllerApi {
  static async paymentStripe(req, res, next) {
    try {
      const { duration } = req.body;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculatePrice(duration),
        currency: "sgd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        statusCode: 200,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sendMail(req, res, next) {
    try {
      const { userId, email } = req.addtionalData;

      const { data } = await axios({
        url: `https://pijetyok-91e3.restdb.io/mail`,
        method: "post",
        headers: {
          "x-apikey": "903f374df2ee50f12013c1adfd2c94870a4bb",
          "Cache-Control": "no-cache",
          Host: "pijetyok-91e3.restdb.io",
        },
        data: {
          to: email,
          subject: "Massage Payment",
          html: "<p> Thank you very much for purchasing the best massage in this universe has ever known, please never stop coming here",
          company: "Pijetyok",
          sendername: "Muhammad Adib Hasany - CEO/Founder of PijetYok",
        },
      });

      res.status(200).json({
        statusCode: 200,
        data,
      });

      console.log(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerApi;

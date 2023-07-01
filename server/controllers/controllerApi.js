const calculatePrice = require("../helpers/subscribePayment");
const stripe = require("stripe")('sk_test_51NOe6GF6N9Yr0jswgafC8DZOrHAPhzN3IA4cYq3ou71t6EjaODyFDdDa51u7SQajSHhAdZ9D1S52KFoOBqUweIuA00cxxriVxp');
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
}

module.exports = ControllerApi;

const calculatePrice = require("../helpers/subscribePayment");
const stripe = require("stripe")(
  "sk_test_51NOe6GF6N9Yr0jswgafC8DZOrHAPhzN3IA4cYq3ou71t6EjaODyFDdDa51u7SQajSHhAdZ9D1S52KFoOBqUweIuA00cxxriVxp"
);
const { ActivityLog } = require("../models");
const admin = require("./firebase_sdk");
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
    
    static async challengeActivity(req, res, next) {
    const userId = req.addtionalData.userId;

    const options = {
      method: "GET",
      url: "https://fitness-calculator.p.rapidapi.com/activities",
      params: {
        intensitylevel: req.addtionalData.level,
      },
      headers: {
        "X-RapidAPI-Key": "3f5498a87bmsha9ea3e5314c773ap1cc751jsn7b8f405938c7",
        "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const activities = response.data.data;
      // Mendapatkan daftar idActivity yang sudah dilakukan oleh user
      const activityLogs = await ActivityLog.findAll({
        where: { UserId: userId },
        attributes: ["idActivity"],
      });
      const completedActivities = activityLogs.map((log) => log.idActivity);

      // Menghapus aktivitas yang sudah dilakukan dari daftar activities
      const filteredActivities = activities.filter(
        (activity) => !completedActivities.includes(activity.id)
      );
      console.log(filteredActivities);
      res.status(200).json(filteredActivities);
    } catch (error) {
      console.error(error);
    }
  }

  static async completedActivity(req, res, next) {
    const userId = req.addtionalData.userId;

    try {
      // Mendapatkan daftar idActivity yang sudah dilakukan oleh user
      const activityLogs = await ActivityLog.findAll({
        where: { UserId: userId },
        attributes: ["idActivity"],
      });
      const completedActivities = activityLogs.map((log) => log.idActivity);

      // Mengambil data aktivitas yang sudah dilakukan
      const options = {
        method: "GET",
        url: "https://fitness-calculator.p.rapidapi.com/activities",
        params: {
          intensitylevel: req.addtionalData.level,
        },
        headers: {
          "X-RapidAPI-Key":
            "3f5498a87bmsha9ea3e5314c773ap1cc751jsn7b8f405938c7",
          "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const activities = response.data.data;

      // Menyaring aktivitas yang telah dilakukan berdasarkan id
      const completedActivityData = activities.filter((activity) =>
        completedActivities.includes(activity.id)
      );

      console.log(completedActivityData);
      res.status(200).json(completedActivityData);
    } catch (error) {
      console.error(error);
    }
  }

  static async calorieBurnedFromActivity(req, res, next) {
    const options = {
      method: "GET",
      url: "https://fitness-calculator.p.rapidapi.com/burnedcalorie",
      params: {
        activityid: "ho_16",
        activitymin: "25",
        weight: "75",
      },
      headers: {
        "X-RapidAPI-Key": "3f5498a87bmsha9ea3e5314c773ap1cc751jsn7b8f405938c7",
        "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  static async notificationHabit(req, res, next) {
    try {
      const { userId: senderId } = req.addtionalData;
      let { receiverId, message } = req.body;
      console.log(admin, "asd");
      // const messagesRef = admin.database().ref("messages");

      // messagesRef.push({ senderId, receiverId: +receiverId, message });
      // const messagePayload = {
      //   notification: {
      //     title: `New message from ${senderId}`,
      //     body: message,
      //   },
      //   topic: receiverId,
      // };
      // admin
      //   .messaging()
      //   .send(messagePayload)
      //   .then((response) => {
      //     res.json({ message: "Message sent successfully." });
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     res.status(500).json({ error: "Failed to send message." });
      //   });
    } catch (error) {
      console.log(error);
      next(error);
    }

    }
  }


module.exports = ControllerApi;

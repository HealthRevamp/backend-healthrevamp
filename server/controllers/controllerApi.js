const calculatePrice = require("../helpers/subscribePayment");
const stripe = require("stripe")(
  "sk_test_51NOe6GF6N9Yr0jswgafC8DZOrHAPhzN3IA4cYq3ou71t6EjaODyFDdDa51u7SQajSHhAdZ9D1S52KFoOBqUweIuA00cxxriVxp"
);
const SerpApi = require("google-search-results-nodejs");
const { ActivityLog } = require("../models");
const axios = require("axios");
const cron = require("node-cron");

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

  static async foodNutrition(req, res, next) {
    try {
      const { searchFood } = req.body;

      const optionsNutrition = {
        method: "GET",
        url: "https://api.calorieninjas.com/v1/nutrition?query=" + searchFood,
        headers: {
          "X-Api-Key": "pUb0ALsgzlV9xtduY/dWdQ==CkdAw2khQ2Sg9ewJ",
        },
      };
      const { data: nutrition } = await axios.request(optionsNutrition); //NUTRITION

      if (nutrition) {
        const search = new SerpApi.GoogleSearch(
          "a8c09d15a0ccc04a296495997d28041bb2338d7569b727382cf8e87bcdfa3adf"
        );

        const params = {
          engine: "google",
          q: searchFood,
        };

        const callback = function (data) {
          const responseData = {
            images: data.knowledge_graph.header_images,
            nutrition,
          };
          res.status(200).json(responseData);
        };

        search.json(params, callback);
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async notificationHabit(req, res, next) {
    try {
      const { message } = req.body;

      const response = await axios.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          notification: {
            title: "Health Revamp",
            body: message,
            image:
              "https://banner2.cleanpng.com/20180330/raq/kisspng-logo-medicine-health-care-health-5abeb8ce528090.2165434215224485903379.jpg",
          },
          to: "e5ocbYAgQ9m97VJCdmnYkd:APA91bF5T3eCT-XZlA7zukecir_xNZ_et7vI9focncDWz_ptk-mmVkvupF0GIngAOwmz2YLlCdJcYfW9nWDVbLCMJYfOVwZgjWSpeZ61eT9cL6K6fWPrA3wxwwt8ishy0EGJG_78BYp5",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "key=AAAAmpreejw:APA91bEawv-N5rlA30wvzqZDuP0pmuKVPLXCiiIYrhlu8zO4S-v5o0UEP5kkV5KDZLaGc9rsjlrmthQgGsFa9bfY5S6XWzpcGZHcnRl8HftMYoeEfpEGJiV-iHzmN6Y8xxecKzVSThzY",
          },
        }
      );
      res.status(200).json({ message: "Notifikasi berhasil dikirim" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async runNotification(req, res, next) {
    // Definisikan fungsi yang akan dijalankan secara berkala
    const cronJob = async () => {
      try {
        // Logika atau tugas yang ingin Anda lakukan
        console.log("Cronjob berjalan pada waktu:", new Date());
        // Tugas atau proses asinkron lainnya bisa ditambahkan di sini
        // Pastikan untuk menangani kesalahan (error handling) dengan benar
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    };

    // Jadwalkan cronjob untuk dijalankan setiap menit
    cron.schedule("* * * * *", async () => {
      await cronJob();
    });

    // Untuk menghentikan cronjob, Anda bisa menggunakan:
    // cron.schedule('* * * * *', async () => {
    //   await cronJob();
    //   cron.schedule('* * * * *', async () => {
    //     process.exit(); // Hentikan cronjob setelah dijalankan sekali
    //   });
    // });
  }
}

module.exports = ControllerApi;

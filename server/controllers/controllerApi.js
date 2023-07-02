const { ActivityLog } = require("../models");
const axios = require("axios");
const admin = require("./firebase_sdk");

class ControllerApi {
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

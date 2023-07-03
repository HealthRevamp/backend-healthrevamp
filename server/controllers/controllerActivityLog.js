const { User, ActivityLog } = require("../models");
const axios = require("axios");

/*
  ACTIVITY LOG DONE
  CREATE ATIVITY + UPDATE TOTAL CALORIE USER 
*/

class controllerActivityLogs {
  static async createActivityLog(req, res, next) {
    const { timeElapsed, idActivity } = req.body;
    const options = {
      method: "GET",
      url: "https://fitness-calculator.p.rapidapi.com/burnedcalorie",
      params: {
        activityid: idActivity,
        activitymin: JSON.parse(timeElapsed),
        weight: JSON.parse(req.addtionalData.weight),
      },
      headers: {
        "X-RapidAPI-Key": "3f5498a87bmsha9ea3e5314c773ap1cc751jsn7b8f405938c7",
        "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
      },
    };

    try {
      const { data } = await axios.request(options);

      const created = await ActivityLog.create({
        calorieBurned: Math.ceil(data.data.burnedCalorie),
        idActivity,
        UserId: req.addtionalData.userId,
      });
      if (created) {
        res.status(201).json({
          statusCode: 201,
          message: created,
        });
        //UPDATE TOTAL CALORIES YANG ADA DI USER
        const user = await User.findByPk(req.addtionalData.userId);
        let totalCalorie = user.totalCalorie + Math.ceil(created.calorieBurned);
        //UPDATE LEVEL
        const updateLevel = Math.floor(totalCalorie / 20000);
        let level = user.level;

        if (updateLevel === 1) {
          level += updateLevel;
        } else if (updateLevel > 1) {
          level = updateLevel;
        }

        await user.update({ totalCalorie, level });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = controllerActivityLogs;

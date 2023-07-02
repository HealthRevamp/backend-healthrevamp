const { User, ActivityLog } = require("../models");

class controllerActivityLogs {
  static async createActivityLog(req, res, next) {
    try {
      const { calorieBurned, timeElapsed, idActivity } = req.body;
      const created = await ActivityLog.create({
        calorieBurned,
        timeElapsed,
        idActivity,
        UserId: req.addtionalData.userId,
      });

      if (created) {
        res.status(201).json({
          statusCode: 201,
          message: created,
        });

        //UPDATE TOTAL CALORIES
        const user = await User.findByPk(req.addtionalData.userId);
        let totalCalorie = user.totalCalorie + Math.ceil(calorieBurned);
        await user.update({ totalCalorie });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = controllerActivityLogs;

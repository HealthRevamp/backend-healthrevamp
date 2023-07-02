const { Habit } = require("../models");

class ControllerHabit {
  static async getHabits(req, res, next) {
    try {
      const { userId } = req.addtionalData;
      console.log(userId);
      const habits = await Habit.findAll({
        where: {
          UserId: userId,
        },
      });
      res.status(200).json({
        statusCode: 200,
        habits,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addHabits(req, res, next) {
    try {
      const { userId } = req.addtionalData;
      const { name, time, description } = req.body;
      const addedHabit = await Habit.create({
        name,
        time,
        description,
        UserId: userId,
      });

      res.status(201).json({
        statusCode: 201,
        message: `Habit added successfully`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteHabits(req, res, next) {
    try {
      const { userId } = req.addtionalData;
      const { id } = req.params;
      const habit = await Habit.findOne({ where: { id } });
      if (!habit) throw { name: "notFound" };
      if (habit.UserId != userId) throw { name: "unauthorized" };
      const deletedHabit = await Habit.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        statusCode: 200,
        message: `Habit deleted successfully`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerHabit;

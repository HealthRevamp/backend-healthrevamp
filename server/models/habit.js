"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Habit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {});
    }
  }
  Habit.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Title must not be null",
          },
          notEmpty: {
            args: true,
            msg: "Title must not be empty",
          },
        },
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Time must not be null",
          },
          notEmpty: {
            args: true,
            msg: "Time must not be empty",
          },
        },
      },
      description: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Habit",
    }
  );
  return Habit;
};

"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.ActivityLog, {});
      this.hasMany(models.Habit, {});
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      endSub: DataTypes.DATE,
      height: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      totalCalorie: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: (user) => {
          const saltRounds = 10;
          const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
          user.password = hashedPassword;
        },
      },

      sequelize,
      modelName: "User",
    }
  );
  return User;
};

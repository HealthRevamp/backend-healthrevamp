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
      this.hasMany(models.Ranking, {});
      this.hasMany(models.Run, {});
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isSubscribed: DataTypes.BOOLEAN,
      startSub: DataTypes.DATE,
      endSub: DataTypes.DATE,
      height: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      totalRun: DataTypes.INTEGER,
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

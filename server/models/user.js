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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Username must not be null",
          },
          notEmpty: {
            args: true,
            msg: "Username must not be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Email must not be null",
          },
          notEmpty: {
            args: true,
            msg: "Email must not be empty",
          },
          isEmail: {
            args: true,
            msg: "Email must be in @example.com format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Password must not be null",
          },
          notEmpty: {
            args: true,
            msg: "Password must not be empty",
          },
        },
      },
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

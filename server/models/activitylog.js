"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
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
  ActivityLog.init(
    {
      calorieBurned: DataTypes.INTEGER,
      idActivity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Activity must not be null",
          },
          notEmpty: {
            args: true,
            msg: "Activity must not be empty",
          },
        },
      },

      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ActivityLog",
    }
  );
  return ActivityLog;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Run extends Model {
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
  Run.init(
    {
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      totalDistance: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Run",
    }
  );
  return Run;
};

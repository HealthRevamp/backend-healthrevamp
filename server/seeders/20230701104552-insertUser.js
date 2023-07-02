"use strict";
const bcrypt = require("bcryptjs");
const udpateDate = require("../helpers/updateDate");
const saltRounds = 10;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "adibcoding",
          password: bcrypt.hashSync("12345678", saltRounds),
          email: "adibhasany1501@gmail.com",
          endSub: udpateDate(new Date(), 30),
          updatedAt: new Date(),
          createdAt: new Date(),
          height: 180,
          weight: 60,
          gender: "female",
          totalRun: 0,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};

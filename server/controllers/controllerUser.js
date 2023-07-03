const { User } = require("../models");
const { generateToken } = require("../helpers/jwt-generator");
const bcrypt = require("bcryptjs");
const udpateDate = require("../helpers/updateDate");

class ControllerUser {
  static async userRegister(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const created = await User.create({
        username,
        email,
        password,
        endSub: udpateDate(new Date(), 30),
        height: 0,
        weight: 0,
        gender: "",
        totalCalorie: 0,
        level: 1,
      });

      if (created) {
        res.status(201).json({
          statusCode: 201,
          message: `${created.id}, ${created.email}`,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } }); // cek ada user atau engga

      if (!user) throw { name: "errorLogin" }; //jika tidak ada user
      console.log(user);
      if (user) {
        // jika ada user
        const access_token = generateToken({
          id: user.id,
          email: user.email,
          password: user.password,
          username: user.username,
          level: user.level,
        });

        if (bcrypt.compareSync(password, user.password)) {
          // di compare passwordnya
          res.status(200).json({
            statusCode: 200,
            access_token: access_token,
            data: {
              username: user.username,
              totalCalorie: user.totalCalorie,
              endSub: user.endSub,
              height: user.height,
              weight: user.weight,
              level: user.level,
            },
          });
        } else throw { name: "errorLogin" }; //boleh di ubah
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      //DATA YANG DI UPDATE USERNAME, HEIGHT, WEIGHT, GENDER

      // const user = await User.findByPk(req.addtionalData.userId);
      // if (!user) throw { name: "notFound" };
      const { userId } = req.addtionalData;
      await User.update(req.body, { where: { id: userId } });
      res.status(200).json({
        statusCode: 200,
        message: "Success to update",
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateSubscribe(req, res, next) {
    try {
      const user = await User.findByPk(req.addtionalData.userId);

      const { endSub } = req.body;
      let newdate = new Date();

      if (user.endSub >= new Date()) {
        //DI CEK APAKAH ENDSUB SUDAH HABIS ATAU BELUM JIKA BELUM AKAN DI TAMBAH DENGAN VALUE
        newdate = udpateDate(user.endSub, endSub);
      } else {
        //JIKA SUDAH HABIS AKAN DITAMBAH DENGAN TANGGAL HARI INI + DENGAN VALUE
        newdate = udpateDate(new Date(), endSub);
      }

      await user.update({ endSub: newdate });

      res.status(200).json({
        statusCode: 200,
        message: "Success to Subscribe",
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateTotalCalorie(req, res, next) {
    try {
      const user = await User.findByPk(req.addtionalData.userId);
      // if (!user) throw { name: "notFound" };

      const { weight, gender } = user;
      // run distance in meters
      const { run } = req.body;

      let calorie = weight * (JSON.parse(run) / 1000) * 0.9;
      if (gender === "male") {
        calorie = weight * (JSON.parse(run) / 1000) * 1.0;
      }

      let updatedTotalCalorie = user.totalCalorie + Math.ceil(calorie);
      const updateLevel = Math.floor(updatedTotalCalorie / 20000);
      let level = user.level;

      if (updateLevel > 1) {
        level += updateLevel;
      }
      await user.update({ totalCalorie: updatedTotalCalorie, level });

      res.status(200).json({
        statusCode: 200,
        message: "Success to Total Calorie",
      });
    } catch (err) {
      next(err);
    }
  }

  static async rangkingCalorie(req, res, next) {
    try {
      const user = await User.findByPk(req.addtionalData.userId);
      // if (!user) throw { name: "notFound" };

      const users = await User.findAll({
        order: [["totalCalorie", "DESC"]],
        limit: 10,
      });

      const currentUserPosition = users.findIndex((u) => u.id === user.id) + 1;
      const totalUsers = await User.count();

      res.status(200).json({
        statusCode: 200,
        message: {
          users,
          currentUserPosition,
          totalUsers,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerUser;

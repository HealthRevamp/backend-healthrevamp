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
        totalRun: 0,
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

      if (user) {
        // jika ada user
        const access_token = generateToken({
          id: user.id,
          email: user.email,
          password: user.password,
          username: user.username,
        });

        if (bcrypt.compareSync(password, user.password)) {
          // di compare passwordnya
          res.status(200).json({
            statusCode: 200,
            access_token: access_token,
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

      const user = await User.findByPk(req.addtionalData.userId);
      if (!user) throw { name: "Datanotfound" };
      if (user) {
        await user.update(req.body);
        res.status(200).json({
          statusCode: 200,
          message: "Success to update",
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateSubscribe(req, res, next) {
    try {
      const user = await User.findByPk(req.addtionalData.userId);
      if (!user) throw { name: "Datanotfound" };

      if (user) {
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
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerUser;

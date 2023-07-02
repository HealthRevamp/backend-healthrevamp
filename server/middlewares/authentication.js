const { verifyToken } = require("../helpers/jwt-generator");
const { User } = require("../models/index");

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "UnaunthenticatedToken" };
    }

    const payload = verifyToken(access_token);

    let user = {};
    user = await User.findOne({ where: { id: payload.id } });

    if (!user) {
      throw { name: "UnaunthenticatedToken" };
    }

    req.addtionalData = {
      userId: user.id,
      level: user.level,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;

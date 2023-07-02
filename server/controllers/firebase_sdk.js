var admin = require("firebase-admin");

var serviceAccount = require("./healtrevamp-firebase-adminsdk-s0esw-c8083867c7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

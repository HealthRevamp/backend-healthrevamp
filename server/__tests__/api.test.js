const { User, ActivityLog } = require("../models");
const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt-generator");
const udpateDate = require("../helpers/updateDate");
let access_token;
let access_token1;
let user;
let user1;

beforeAll(async () => {
  // Clears the database and adds some testing data.
  // Jest will wait for this promise to resolve before running tests.
  try {
    user = await User.create({
      username: "adib",
      email: "muhammadadibhasany1501@gmail.com",
      password: "12345678",
      endSub: udpateDate(new Date(), 30),
      height: 165,
      weight: 60,
      gender: "",
      totalCalorie: 0,
      level: 1,
    });
    user1 = await User.create({
      username: "adibas",
      email: "adibhasany1501@gmail.com",
      password: "12345678",
      endSub: udpateDate(new Date(), 30),
      height: 0,
      weight: 0,
      gender: "",
      totalCalorie: 0,
      level: 1,
    });
    access_token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      level: user.level,
    });

    access_token1 = generateToken({
      id: user1.id,
      email: user1.email,
      username: user1.username,
      level: user1.level,
    });
  } catch (err) {
    console.log(err);
  }
});

afterAll((done) => {
  ActivityLog.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      return User.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("post /api/mail", function () {
  it("Success Mail", async function () {
    const response = await request(app)
      .post("/api/mail")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("data");
  });
});

describe("get /api/activity", function () {
  it("Success activity", async function () {
    const response = await request(app)
      .get("/api/activity")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
  });
});

describe("get /api/completedActivity", function () {
  it("Success completedActivity", async function () {
    const response = await request(app)
      .get("/api/completedActivity")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
  });
});

describe("get /api/notification", function () {
  it("Success notification", async function () {
    const response = await request(app)
      .get("/api/notification")
      .send({
        message: "asd",
      })
      .set({ access_token, Accept: "application/json" });

    expect(response.status).toEqual(200);
  });
});

describe("post /api/food-nutrition", function () {
  it("Success food-nutrition", async function () {
    const response = await request(app)
      .post("/api/food-nutrition")
      .send({
        searchFood: "Banana",
      })
      .set({ access_token, Accept: "application/json" });

    expect(response.status).toEqual(200);
  });
});

describe("post /api/payment", function () {
  it("Success Payment", async function () {
    const response = await request(app)
      .post("/api/payment")
      .send({
        duration: 30,
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("clientSecret");
  });

  it("Success Payment", async function () {
    const response = await request(app)
      .post("/api/payment")
      .send({
        duration: 180,
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("clientSecret");
  });

  it("Success Payment", async function () {
    const response = await request(app)
      .post("/api/payment")
      .send({
        duration: 360,
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("clientSecret");
  });

  it("Success Payment", async function () {
    const response = await request(app)
      .post("/api/payment")
      .send({
        duration: 0,
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("clientSecret");
  });
});

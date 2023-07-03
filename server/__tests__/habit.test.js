const request = require("supertest");
const assert = require("assert");
const app = require("../app");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/jwt-generator");
const { User, Habit } = require("../models");
const udpateDate = require("../helpers/updateDate");
let access_token;
let access_token1;
let user;

beforeAll(async () => {
  // Clears the database and adds some testing data.
  // Jest will wait for this promise to resolve before running tests.
  try {
    user = await User.create({
      username: "adib",
      email: "muhammadadibhasany1501@gmail.com",
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
  } catch (err) {
    console.log(err);
  }
});

afterAll((done) => {
  Habit.destroy({ truncate: true, cascade: true, restartIdentity: true })
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

describe("post /habits", function () {
  it("Success Post habits 201", async function () {
    const response = await request(app)
      .post("/habits")
      .send({
        name: "asdasd",
        time: "2023-06-06",
        description: "asdasd",
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(
      new RegExp("Habit added successfully")
    );
  });
});

describe("get /habits", function () {
  it("Success fetch 200", async function () {
    const response = await request(app)
      .get("/habits")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("habits");
  });
});

describe("get one /habits", function () {
  it("Success fetch 200", async function () {
    const response = await request(app)
      .get("/habits/1")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("habit");
  });
});

describe("delete /habits", function () {
  it("Success delete 200", async function () {
    const response = await request(app)
      .delete("/habits/1")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
  });
});

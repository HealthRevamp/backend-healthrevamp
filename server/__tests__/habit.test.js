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
      height: 0,
      weight: 0,
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

  it("Failed Post habits 400", async function () {
    const response = await request(app)
      .post("/habits")
      .send({
        name: "",
        time: "",
        description: "asdasd",
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
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

  it("Failed fetch 404", async function () {
    const response = await request(app)
      .get("/habits/1000000")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
  });
});

describe("delete /habits", function () {
  it("Failed delete 403", async function () {
    const response = await request(app)
      .delete("/habits/1")
      .set({ access_token: access_token1, Accept: "application/json" });
    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
  });

  it("Success delete 200", async function () {
    const response = await request(app)
      .delete("/habits/1")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
  });
});

const request = require("supertest");
const assert = require("assert");
const app = require("../app");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
let access_token;
// const salt = bcrypt.genSaltSync(10);

beforeAll(async () => {
  // Clears the database and adds some testing data.
  // Jest will wait for this promise to resolve before running tests.
  try {
    console.log("here before all");
  } catch (err) {
    console.log(err);
  }
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("post /users/register", function () {
  it("Success Register 201", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "muhammadadibhasany1501@gmail.com",
        password: "12345678",
        username: "adib",
      })
      .set("Accept", "application/json");
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("@"));
  });

  it("Failed Register 409", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "muhammadadibhasany1501@gmail.com",
        password: "12345678",
        username: "adib",
      })
      .set("Accept", "application/json");
    expect(response.status).toEqual(409);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Email in use"));
  });

  it("Failed Register 400", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "",
        password: "",
        username: "",
      })
      .set("Accept", "application/json");
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message.length).toBeGreaterThan(0);
  });
});

describe("post /users/login", function () {
  it("Failed Login no users found 401", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "muhammadadibhasany@gmail.com",
        password: "12345678",
      })
      .set("Accept", "application/json");
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Invalid email/password"));
  });

  it("Failed Login password wrong 401", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "muhammadadibhasany1501@gmail.com",
        password: "123456",
      })
      .set("Accept", "application/json");
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Invalid email/password"));
  });

  it("Success Login 200", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "muhammadadibhasany1501@gmail.com",
        password: "12345678",
      })
      .set("Accept", "application/json");
    access_token = response.body.access_token;
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("access_token");
  });
});

describe("put /users/update", function () {
  it("Success Update", async function () {
    const response = await request(app)
      .put("/users/update")
      .send({
        username: "adib",
        height: 45,
        weight: 70,
        gender: "Female",
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Success to update"));
  });

  it("Failed Update fail authentication incorrect token 401", async function () {
    const response = await request(app)
      .put("/users/update")
      .send({
        username: "adib",
        height: 45,
        weight: 70,
        gender: "Female",
      })
      .set({ access_token: "sadasd", Accept: "application/json" });
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Invalid token"));
  });

  it("Failed Update fail authentication no token 401", async function () {
    const response = await request(app)
      .put("/users/update")
      .send({
        username: "adib",
        height: 45,
        weight: 70,
        gender: "Female",
      })
      .set({ Accept: "application/json" });
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Error authentication"));
  });
});

describe("patch /users/updateSub", function () {
  it("Success Update", async function () {
    const response = await request(app)
      .patch("/users/updateSub")
      .send({
        endSub: 30,
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Success to update"));
  });
});

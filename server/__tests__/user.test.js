const request = require("supertest");
const assert = require("assert");
const app = require("../app");
const { User } = require("../models");
let access_token;
let access_token1;
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

  it("Success Register 201", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({
        email: "adibhasany1501@gmail.com",
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
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("username");
    expect(response.body.data).toHaveProperty("totalCalorie");
    expect(response.body.data).toHaveProperty("endSub");
    expect(response.body.data).toHaveProperty("height");
    expect(response.body.data).toHaveProperty("weight");
    expect(response.body.data).toHaveProperty("level");
  });

  it("Success Login 200", async function () {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "adibhasany1501@gmail.com",
        password: "12345678",
      })
      .set("Accept", "application/json");
    access_token1 = response.body.access_token;
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("username");
    expect(response.body.data).toHaveProperty("totalCalorie");
    expect(response.body.data).toHaveProperty("endSub");
    expect(response.body.data).toHaveProperty("height");
    expect(response.body.data).toHaveProperty("weight");
    expect(response.body.data).toHaveProperty("level");
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
        gender: "female",
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Success to update"));
  });

  it("Success Update 200: male", async function () {
    const response = await request(app)
      .put("/users/update")
      .send({
        username: "a",
        height: 45,
        weight: 70,
        gender: "male",
      })
      .set({ access_token: access_token1, Accept: "application/json" });
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
        gender: "female",
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
  it("Success Update sub", async function () {
    const response = await request(app)
      .patch("/users/updateSub")
      .send({
        endSub: 30,
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Success to Subscribe"));
  });

  it("Failed update sub failed 401", async function () {
    const response = await request(app)
      .patch("/users/updateSub")
      .send({
        endSub: 30,
      })
      .set({ access_token: "sadasd", Accept: "application/json" });
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Invalid token"));
  });

  it("Failed Update sub failed no token 401", async function () {
    const response = await request(app)
      .patch("/users/updateSub")
      .send({
        endSub: 30,
      })
      .set({ Accept: "application/json" });
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Error authentication"));
  });
});

describe("patch /users/updateCal", function () {
  it("Success Update calories", async function () {
    const response = await request(app)
      .patch("/users/updateCal")
      .send({
        run: 2000,
      })
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(
      new RegExp("Success to Total Calorie")
    );
  });

  it("Success Update calories: male", async function () {
    const response = await request(app)
      .patch("/users/updateCal")
      .send({
        run: 200000000,
      })
      .set({ access_token: access_token1, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(
      new RegExp("Success to Total Calorie")
    );
  });

  it("Failed Update fail authentication no token 401", async function () {
    const response = await request(app)
      .put("/users/update")
      .send({
        run: 2000,
      })
      .set({ Accept: "application/json" });
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Error authentication"));
  });

  it("Failed Update fail authentication incorrect token 401", async function () {
    const response = await request(app)
      .put("/users/update")
      .send({
        run: 2000,
      })
      .set({ access_token: "sadasd", Accept: "application/json" });
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(new RegExp("Invalid token"));
  });
});

describe("get /users/ranking", function () {
  it("Success get ranking 200", async function () {
    const response = await request(app)
      .get("/users/ranking")
      .set({ access_token, Accept: "application/json" });
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toHaveProperty("users");
    expect(response.body.message).toHaveProperty("currentUserPosition");
    expect(response.body.message).toHaveProperty("totalUsers");
  });
});

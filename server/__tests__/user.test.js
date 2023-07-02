const request = require("supertest");
const assert = require("assert");
const app = require("../app");
const bcrypt = require("bcryptjs");
beforeAll(async () => {
  // Clears the database and adds some testing data.
  // Jest will wait for this promise to resolve before running tests.
  try {
    console.log("here before all");
  } catch (err) {
    console.log(err);
  }
});

describe("post /users/register", function () {
  it("Success Register", async function () {
    const response = await request(app)
      .post("/users/register")
      .send({ email: "muhammadadibhasany1501@gmail.com", password: "12345678",  })
      .set("Accept", "application/json");
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
  });

});

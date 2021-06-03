const login = require("../../routes/auth");
var express = require("express");
const request = require("supertest");
var app = express();



describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app.use(login))
      .post("/TestLogin")
      .send({
        username: "liadna",
        password: "147147"
      })
      .then(res => {
        expect(res.statusCode).toBe(200);
      });
  });
});

  test('should test that true === true', () => {
    expect(true).toBe(true)
  })
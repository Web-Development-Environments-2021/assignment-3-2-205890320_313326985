const login = require("../../routes/auth");
var async = require('async');
var express = require("express");
var router = express.Router();
var app = express();
test('successful user login', () => {
    var res = new Object();
    res.status = 400;
    res.send = "bad request";

    var req = new Object();
    req.body = new Object();
    req.body.username = "naorbe";
    req.body.password = "2a$13$6HoWetVKgfuC0G6EwxnCMu0zkf6tZJO3Xct4lLvXReNstjgWgV9cK";

    var next = new Object();

    var res_toBe = new Object();
    res_toBe.status = 200;
    res_toBe.send = "login succeeded";

    expect(login.post((req, res, next)))
    .toBe(async function(req, res_toBe) {res_toBe});
  });

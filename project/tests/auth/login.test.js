const login = require("../../routes/auth");
var async = require('async');
var express = require("express");
var router = express.Router();
test('Unsuccessful user login, user invalid', () => {
    var req = new Object();
    req.body = new Object();
    req.body.username = "naorb";
    var res = new Object();
    res.status = 401;
    res.send = "Username or Password incorrect";
    var next = new Object();
    expect(login.post("/Login", async (req, res, next))
    ).toBe(res);
  });

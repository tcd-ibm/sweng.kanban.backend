var express = require("express");
var router = express.Router();
var User = require("../models/UserModel");
var passport = require("passport");

router.post("/register", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.register(
    new User({ username: username }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      } else {
        passport.authenticate("local")(req, res, function (err) {
          if (err) {
            return res.sendStatus(500);
          } else {
            return res.sendStatus(200);
          }
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), function (req, res) {
  return res.sendStatus(200);
});

router.get("/logout", function (req, res) {
  req.logout();
  return res.sendStatus(200);
});

module.exports = router;

var express = require("express");
var router = express.Router();
var User = require("./models/userModel");

router.post("/register", function (req, res) {
    var email = req.body.email
    var password = req.body.password
    User.register(new User({ email: email }),
        password, function (err, user) {
            if (err) {
                console.log(err);
                return res.sendStatus(200);
            }
        });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}),
    function (req, res) {
    });



router.get("/logout", function (req, res) {
    req.logout();
    return res.sendStatus(200);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    console.log("Not logged in");
}

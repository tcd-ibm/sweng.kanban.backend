var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    return res.send("Kanban API is up!");
  });

module.exports = router;
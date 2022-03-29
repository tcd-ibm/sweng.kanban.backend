var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    res.send("Kanban API is up!");
    return;
  });

module.exports = router;
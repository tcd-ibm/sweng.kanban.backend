/*External dependecies*/

var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv").config();
var https = require("https");

/*routers*/

var kanbanBoardRouter = require("./routes/KanbanBoardRoutes");
var testRouter = require("./routes/TestRoutes");
var taskRouter = require("./routes/TaskRoutes");
var swimLaneRouter = require("./routes/SwimLaneRoutes");
var rootRouter = require("./routes/RootRoutes");

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", kanbanBoardRouter);
app.use("/", testRouter);
app.use("/", taskRouter);
app.use("/", swimLaneRouter);
app.use("/", rootRouter);

/*Connecting to database*/

console.log("Attempting to log in to database!");

mongoose.connect(process.env.MONGODB_URL,
  {
    serverSelectionTimeoutMS: 60 * 1000, 
  });
mongoose.connection.on("error", (error) => {
  console.log("Database connection error!. Here is the error:", error);
});
mongoose.connection.once("open", () => {
  console.log("Connected to Database!");
});

/*404 error handler*/
app.use(function (req, res, next) {
  next(createError(404));
});

/*general error handler*/
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json(err.message);
});

https
  .createServer(
  {
    key: process.env.KEY_PEM,
    cert: process.env.CERT_PEM,
  },
  app
  )
  .listen(process.env.PORT || 8080, function (){
    console.log("Listening to Port: " + process.env.PORT || 8080);
});

/*External dependecies*/

var createError = require("http-errors");
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv").config();

/*models*/

var kanbanBoardModel = require("./models/KanbanBoardModel");

var swimLaneModel = require("./models/SwimLaneModel");

/*routers*/

var kanbanBoardRouter = require("./routes/KanbanBoardRoutes");

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", kanbanBoardRouter);

/*Connecting to database*/

mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("error", (error) => {
  console.log("Database connection error:", error);
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

/*default error handler for DB*/
function defaultDbError(err) {
  if (err) {
    console.log(err);
  }
}
/*populate database with test kanban board*/

const todo = new swimLaneModel({ swimLaneTitle: "todo" });
todo.save(defaultDbError);

const doing = new swimLaneModel({ swimLaneTitle: "doing" });
doing.save(defaultDbError);

const done = new swimLaneModel({ swimLaneTitle: "done" });
done.save(defaultDbError);

const testKanbanBoard = new kanbanBoardModel({
  kanbanBoardTitle: "Test",
  kanbanBoardSwimLanes: [todo._id, doing._id, done._id]
});

testKanbanBoard.save(function(err, testBoard){
  console.log(testBoard);
});

/*start listening*/
app.listen(process.env.PORT || 8080, function () {
  console.log("Listening to Port: " + process.env.PORT || 8080);
});

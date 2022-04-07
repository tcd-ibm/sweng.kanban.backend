var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");
var swimLaneModel = require("../models/SwimLaneModel");
var taskModel = require("../models/TaskModel")

function defaultDbError(err) {
  if (err) {
    console.log(err);
  }
}

router.post("/addDummyData", function (req, res, next) {

  /*populate database with test kanban board*/
  const todo = new swimLaneModel({ swimLaneTitle: "todo" });
  todo.save(defaultDbError);

  const doing = new swimLaneModel({ swimLaneTitle: "doing" });
  doing.save(defaultDbError);

  const done = new swimLaneModel({ swimLaneTitle: "done" });
  done.save(defaultDbError);

  const testKanbanBoard = new kanbanBoardModel({
    kanbanBoardTitle: "Test",
    kanbanBoardSwimLanes: [todo._id, doing._id, done._id],
  });

  testKanbanBoard.save(function (err, testBoard) {
    if(err){
      console.log(err);
      return res.sendStatus(500);
    }
    else{
      return res.send("Succesfully added dummy data!");
    }
  });
});

router.delete("/deleteAllBoards", function(req, res, next){
    kanbanBoardModel.deleteMany({}, function(err){
        if(err){
           console.log(err);
           return res.sendStatus(500);
        }
        else{
          return res.send("Deleted all Kanban Boards!");
        }
    });
});

router.delete("/deleteAllSwimLanes", function(req, res, next){
    swimLaneModel.deleteMany({}, function(err){
        if(err){
          console.log(err);
          return res.sendStatus(500);
        }
        else{
          return res.send("Succesfully deleted all SwimLanes!");
        }
    });

});

router.delete("/deleteAllTasks", function(req, res, next){
    taskModel.deleteMany({}, function(err){
        if(err){
          console.log(err);
          return res.sendStatus(500);
        }
        else{
          return res.send("Succesfully deleted all Tasks!");
        }
    });

});

module.exports = router;

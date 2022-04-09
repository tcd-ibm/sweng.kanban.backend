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

  const task1 = new taskModel({taskTitle: "test 1", taskDescription: "test 1"});
  task1.save(defaultDbError);

  const task2 = new taskModel({taskTitle: "test 2", taskDescription: "test 2"});
  task2.save(defaultDbError);

  const task3 = new taskModel({taskTitle: "test 3", taskDescription: "test 3"});
  task3.save(defaultDbError);

  const task4 = new taskModel({taskTitle: "test 4", taskDescription: "test 4"});
  task4.save(defaultDbError);


  const todo = new swimLaneModel({ swimLaneTitle: "todo" , kanbanSwimLaneTasks: [task1._id]});
  todo.save(defaultDbError);

  const doing = new swimLaneModel({ swimLaneTitle: "doing", kanbanSwimLaneTasks: [task2._id, task3._id] });
  doing.save(defaultDbError);

  const done = new swimLaneModel({ swimLaneTitle: "done", kanbanSwimLaneTasks: [task4._id] });
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
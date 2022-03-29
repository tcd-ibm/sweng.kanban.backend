var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");
var swimLaneModel = require("../models/SwimLaneModel");

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
    console.log(testBoard);
  });

  res.send("Succesfully added dummy data!");
  return;
});

router.delete("/deleteAllBoards", function(req, res, next){
    kanbanBoardModel.deleteMany({}, function(err){
        if(err){
            res.send(err);
            return;
        }
        else{
            res.send("Succesfully deleted all boards!");
            return;
        }
    });
});

router.delete("/deleteAllSwimLanes", function(req, res, next){
    swimLaneModel.deleteMany({}, function(err){
        if(err){
            res.send(err);
            return;
        }
        else{
            res.send("Succesfully deleted all SwimLanes!");
            return;
        }
    });
});

module.exports = router;
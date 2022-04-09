var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");
var swimLaneModel = require("../models/SwimLaneModel");
var taskModel = require("../models/TaskModel");

router.post("/moveTask", function (req, res, next) {
  const oldswimlaneId = req.body.oldSwimLaneId;
  const targetswimlaneId = req.body.targetSwimLaneId;
  const taskId = req.body.taskId;

  if (taskId  && oldswimlaneId && targetswimlaneId) {
    taskModel.findOne(
      { _id: taskId},
      function (err, taskFound) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else if(taskFound){
          const id = taskFound._id;

          swimLaneModel.findOne(
            { _id: oldswimlaneId },
            function (err, swimLane) {
              if (err) {
                console.log(err);
                return res.sendStatus(500);
              } else if (swimLane) {
                if (swimLane.kanbanSwimLaneTasks.includes(id)) {
                  swimLaneModel.findOne(
                    { _id: targetswimlaneId },
                    function (err, swimLane) {
                      if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                      } else if (swimLane) {
                        if (!(swimLane.kanbanSwimLaneTasks.includes(id))) {
                          swimLaneModel.findOneAndUpdate(
                            { _id: oldswimlaneId },
                            { $pull: { kanbanSwimLaneTasks: id } },
                            { new: true },
                            function (err, updatedSwimlane) {
                              if (err) {
                                return res.sendStatus(500);
                              } else {
                                swimLaneModel.findOneAndUpdate(
                                  { _id: targetswimlaneId },
                                  { $push: { kanbanSwimLaneTasks: id } },
                                  { new: true },
                                  function (err, movedToSwimlane) {
                                    if (err) {
                                      console.log(err);
                                      return res.sendStatus(500);
                                    } else {
                                      return res.send(movedToSwimlane);
                                    }
                                  }
                                );
                              }
                            }
                          );
                        } else {
                          console.log("Task is already in SwimLane");
                          return res.send("Task is already in SwimLane");
                        }
                      } else {
                        console.log("No target swimlane exists!");
                        return res.sendStatus(404);
                      }
                    }
                  );
                } else {
                  console.log("Task not present in the old swimlane");
                  return res.sendStatus(404);
                }
              } else {
                console.log("Old swimlane does not exist!");
                return res.sendStatus(404);
              }
            }
          );
        }
        else{
          console.log("Task does not exist!");
          return res.sendStatus(404);
        }
      }
    );
  } else {
    return res.sendStatus(400);
  }
});

module.exports = router;

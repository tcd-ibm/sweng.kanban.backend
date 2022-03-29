var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");
var swimLaneModel = require("../models/SwimLaneModel");
var taskModel = require("../models/TaskModel");

router.post("/moveTask", function (req, res, next) {
  const oldswimlaneTitle = req.body.oldSwimlane;
  const targetswimlaneTitle = req.body.targetSwimlane;
  const taskTitle = req.body.taskTitle;
  const taskDescription = req.body.taskDescription;

  if (taskTitle && taskDescription && oldswimlaneTitle && targetswimlaneTitle) {
    taskModel.findOne(
      { taskTitle: taskTitle, taskDescription: taskDescription },
      function (err, taskFound) {
        if (err) {
          return res.sendStatus(500);
        } else {
          const id = taskFound._id;

          swimLaneModel.findOneAndUpdate(
            { swimLaneTitle: oldswimlaneTitle },
            { $pull: { kanbanSwimLaneTasks: id } },
            { new: true },
            function (err, updatedSwimlane) {
              if (err) {
                return res.sendStatus(500);
              } else {
                swimLaneModel.findOneAndUpdate(
                  { swimLaneTitle: targetswimlaneTitle },
                  { $push: { kanbanSwimLaneTasks: id } },
                  { new: true },
                  function (err, movedToSwimlane) {
                    if (err) {
                      return res.sendStatus(500);
                    } else {
                      return res.send(movedToSwimlane);
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } else {
    return res.sendStatus(400);
  }
});

module.exports = router;
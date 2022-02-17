var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");
var swimLaneModel = require("../models/SwimLaneModel");
var taskModel = require("../models/Tasks")

router.post("/moveTask", function (req, res, next) {
    const taskTitle = req.body.taskTitle;
    const taskDescription = req.body.taskDescription;
    const targetswimlaneTitle = req.body.targetSwimlane;
    const oldswimlaneTitle = req.body.oldSwimlane;

    if (taskTitle && taskDescription && oldswimlaneTitle && targetswimlaneTitle) {
        taskModel.findOne(
            { taskTitle: taskTitle, taskDescription: taskDescription  },
            function (err, taskFound) {
              if (err) {
                res.send(err);
              } else {
                const id = taskFound._id;

                swimLaneModel.findOneAndUpdate(
                  { swimLaneTitle : oldswimlaneTitle  },
                  { $pull : { kanbanSwimLaneTasks: id } },
                  { new: true },
                  function (err, updatedSwimlane) {
                    if (err) {
                      res.send(err);
                    } else {
                      res.send(updatedSwimlane);
                    }
                  }
                );

                swimLaneModel.findOneAndUpdate(
                  { swimLaneTitle : targetswimlaneTitle  },
                  { $push : { kanbanSwimLaneTasks: id } },
                  { new: true },
                  function (err, updatedSwimlane) {
                    if (err) {
                      res.send(err);
                    } else {
                      res.send(updatedSwimlane);
                    }
                  }
                );
                
                res.send("task between swimlanes");
              }
            }
          );
          }
        });

module.exports = router;
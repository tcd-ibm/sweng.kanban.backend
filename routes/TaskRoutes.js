var express = require("express");
var router = express.Router();

/*models*/

var swimLaneModel = require("../models/SwimLaneModel");
var taskModel = require("../models/TaskModel")

router.post("/createTask", function (req, res, next) {
    const taskTitle = req.body.taskTitle;
    const taskDescription = req.body.taskDescription;
    const swimlaneTitle = req.body.swimlaneTitle;

    if (taskTitle && taskDescription && swimlaneTitle) {
        const newTask = new taskModel({
            taskTitle: taskTitle,
            taskDescription: taskDescription
        });
        newTask.save(function (err) {
            if (err) {
                return res.sendStatus(500);
            }
            else{
              swimLaneModel.findOneAndUpdate(
                { swimLaneTitle: swimlaneTitle },
                { $push: { kanbanSwimLaneTasks: newTask._id } },
                { new: true },
                function (err, updatedSwimlane) {
                  if (err) {
                    return res.sendStatus(500);
                  } else {
                    return res.send(updatedSwimlane);
                  }
                }
              );
            }
        });

    }
    else {
      return res.sendStatus(400);  
    }
});

module.exports = router;
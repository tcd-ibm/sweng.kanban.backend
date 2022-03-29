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
                res.send(err);
                return;
            } else {
                res.send("Successfully created a new task");
                return;
            }
        });

        swimLaneModel.findOneAndUpdate(
            { swimLaneTitle: swimlaneTitle },
            { $push: { kanbanSwimLaneTasks: newTask._id } },
            { new: true },
            function (err, updatedSwimlane) {
              if (err) {
                res.send(err);
                return;
              } else {
                res.send(updatedSwimlane);
                return;
              }
            }
          );
    }
    else {
        res.send("Missing parameters!")
        return;
    }
});

module.exports = router;
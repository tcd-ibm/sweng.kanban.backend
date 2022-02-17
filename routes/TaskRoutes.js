var express = require("express");
var router = express.Router();

/*models*/

var swimLaneModel = require("../models/SwimLaneModel");
var taskModel = require("../models/Tasks")

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
            } else {
                res.send("Successfully created a new task");
            }
        });

        swimLaneModel.findOneAndUpdate(
            { swimLaneTitle: swimlaneTitle },
            { $push: { kanbanSwimLaneTasks: newTask._id } },
            { new: true },
            function (err, updatedSwimlane) {
              if (err) {
                res.send(err);
              } else {
                res.send(updatedSwimlane);
              }
            }
          );
    }
    else {
        res.send("missing parameters")
    }
});
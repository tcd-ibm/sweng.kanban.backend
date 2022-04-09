var express = require("express");
var router = express.Router();

/*models*/

var swimLaneModel = require("../models/SwimLaneModel");
var taskModel = require("../models/TaskModel")

router.post("/createTask", function (req, res, next) {
    const taskTitle = req.body.taskTitle;
    const taskDescription = req.body.taskDescription;
    const swimlaneId= req.body.swimLaneId;

    if (taskTitle && taskDescription && swimlaneId) {
        
      swimLaneModel.findOne(
        { _id: swimlaneId },
        function(err, swimLane){
          if(err){
            console.log(err);
            return res.sendStatus(500);
          }
          else if(swimLane){
            const newTask = new taskModel({
              taskTitle: taskTitle,
              taskDescription: taskDescription});
              newTask.save(function (err) {
                  if (err) {
                      return res.sendStatus(500);
                  }
                  else{
                    swimLaneModel.findOneAndUpdate(
                      { _id: swimlaneId },
                      { $push: { kanbanSwimLaneTasks: newTask._id }},
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
          else{
            console.log("Swimlane does not exist!")
            return res.sendStatus(404);
          }
        }
      );
    }
    else {
      return res.sendStatus(400);  
    }
});

module.exports = router;
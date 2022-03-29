var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");

var swimLaneModel = require("../models/SwimLaneModel");

var taskModel = require("../models/TaskModel");

router.get("/listAllKanbanBoards", function (req, res, next) {
  console.log("Attempting to list all kanbanboards");
  kanbanBoardModel
    .find({})
    .populate({
      path: 'kanbanBoardSwimLanes',
      populate: { 
        path: 'kanbanSwimLaneTasks',
        model:'Task'
      }
    })
    .exec(function (err, boards) {
      console.log("Receive response from database!");
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.send(boards);
      }
    });
});

router.get("/findKanbanBoardByTitle", function (req, res, next) {
  const title = req.headers["title"];

  if (title) {
    kanbanBoardModel
      .findOne({ kanbanBoardTitle: title })
      .populate("kanbanBoardSwimLanes")
      .exec(function (err, board) {
        if (err) {
          return res.sendStatus(500);
        } else {
          return res.send(board);
        }
      });
  } else {
    return res.sendStatus(400);
  }
});

router.delete("/deleteKanbanBoardByTitle", function (req, res, next) {
  const title = req.body.title;

  if (title) {
    kanbanBoardModel.findOneAndDelete(
      { kanbanBoardTitle: title },
      function (err, deleted) {
        if (err) {
          return res.sendStatus(500);
        } else {
          swimLaneModel.findMany(
            { _id: { $in: deleted.kanbanBoardSwimLanes } },
            function (err, docs) {
              if (err) {
                return res.sendStatus(500);
              } else {

                let allTasks = [];

                for(let i = 0; i < docs.length; i++) {
                  allTasks = allTasks.concat(docs[i].kanbanSwimLaneTasks)
                }
                taskModel.deleteMany(
                  { _id: { $in: allTasks } },
                  function (err) {
                    if (err) {
                      return res.sendStatus(500);
                    }
                    else{
                      swimLaneModel.deleteMany(
                        { _id: { $in: deleted.kanbanBoardSwimLanes } },
                        function (err) {
                          if (err) {
                            return res.sendStatus(500);
                          } else {
                            return res.send(
                              "Deleted successfully, deleted swimLanes: "
                            );
                          }
                        }
                      );
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

router.post("/createNewKanbanBoard", function (req, res, next) {
  const title = req.body.title;

  if (title) {
    const newKanbanBoard = new kanbanBoardModel({ kanbanBoardTitle: title });
    newKanbanBoard.save(function (err) {
      if (err) {
        return send.sendStatus(500);
      } else {
        return res.send("Successfully created a new kanban board");   
      }
    });
  } else {
    return res.sendStatus(400);
  }
});

router.post("/addSwimLaneToBoard", function (req, res, err) {
  const swimLaneTitle = req.body.swimLaneTitle;
  const kanbanBoardTitle = req.body.kanbanBoardTitle;

  if (swimLaneTitle && kanbanBoardTitle) {
    const uniqueSwimLaneTitle = kanbanBoardTitle + "/" + swimLaneTitle;
    const newSwimLane = new swimLaneModel({
      swimLaneTitle: uniqueSwimLaneTitle,
    });

    newSwimLane.save(function (err) {
      if (err) {
        return res.sendStatus(500);
      }
      else{
        kanbanBoardModel.findOneAndUpdate(
          { kanbanBoardTitle: kanbanBoardTitle },
          { $push: { kanbanBoardSwimLanes: newSwimLane._id } },
          { new: true },
          function (err, updatedBoard) {
            if (err) {
              return res.sendStatus(500);
            } else {
              return res.send(updatedBoard);
            }
          }
        );
      }
    });  
  } else {
    return res.sendStatus(400);
  }
});

module.exports = router;

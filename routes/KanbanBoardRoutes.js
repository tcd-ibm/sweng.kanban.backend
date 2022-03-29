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
        console.log(err);
        res.send(err);
        return;

      } else {
        res.send(boards);
        return;
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
          res.send(err);
          return;
        } else {
          res.send(board);
          return;
        }
      });
  } else {
    res.send("Title not specified!");
    return;
  }
});

router.delete("/deleteKanbanBoardByTitle", function (req, res, next) {
  const title = req.body.title;

  if (title) {
    kanbanBoardModel.findOneAndDelete(
      { kanbanBoardTitle: title },
      function (err, deleted) {
        if (err) {
          res.send(err);
          return;
        } else {
          swimLaneModel.findMany(
            { _id: { $in: deleted.kanbanBoardSwimLanes } },
            function (err, docs) {
              if (err) {
                res.send(err);
                return;
              } else {
                for (let i = 0; i < docs.length; i++) {
                  taskModel.deleteMany(
                    { _id: { $in: docs[i].kanbanSwimLaneTasks } },
                    function (err) {
                      if (err) {
                        res.send(err);
                        return;
                      }
                    }
                  );
                }
              }
            }
          );

          swimLaneModel.deleteMany(
            { _id: { $in: deleted.kanbanBoardSwimLanes } },
            function (err) {
              if (err) {
                res.send(err);
                return;
              } else {
                res.send(
                  "Deleted successfully, deleted swimLanes: " +
                    deleted.kanbanBoardSwimLanes
                );
                return;
              }
            }
          );
        }
      }
    );
  } else {
    res.send("Title not specified!");
    return;
  }
});

router.post("/createNewKanbanBoard", function (req, res, next) {
  const title = req.body.title;

  if (title) {
    const duplicate = kanbanBoardModel.findOne(
      { kanbanBoardTitle: title },
      function (err, duplicate) {
        if (err) {
          res.send(err);
          return;
        } else {
          if (duplicate) {
            res.send("Such board already exists");
            return;
          }
        }
      }
    );

    const newKanbanBoard = new kanbanBoardModel({ kanbanBoardTitle: title });
    newKanbanBoard.save(function (err) {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send("Successfully created a new kanban board");
        return;
      }
    });
  } else {
    res.send("Title not specified, no board created!");
    return;
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
        res.send(err);
        return;
      }
    });

    kanbanBoardModel.findOneAndUpdate(
      { kanbanBoardTitle: kanbanBoardTitle },
      { $push: { kanbanBoardSwimLanes: newSwimLane._id } },
      { new: true },
      function (err, updatedBoard) {
        if (err) {
          res.send(err);
          return;
        } else {
          res.send(updatedBoard);
          return;
        }
      }
    );
  } else {
    if (kanbanBoardTitle) {
      res.send("SwimLane title not specified!");
      return;
    } else if (swimLaneTitle) {
      res.send("Kanban Board title not specified!");
      return;
    } else {
      res.send("Kanban board title and SwimLane title not specified!");
      return;
    }
  }
});

module.exports = router;

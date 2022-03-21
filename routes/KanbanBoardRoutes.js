var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");

var swimLaneModel = require("../models/SwimLaneModel");

var taskModel = require("../models/TaskModel");
// misplele test
router.get("/listAllKanbanBoards", function (req, res, next) {
  console.log("Attempting to list all kanbanboards");
  kanbanBoardModel
    .find({})
    .populate({
      path    : 'kanbanBoardSwimLanes',
      populate: { path: ' kanbanSwimLaneTasks' }
    })
    .exec(function (err, boards) {
      console.log("Receive response from database!");
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(boards);
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
        } else {
          res.send(board);
        }
      });
  } else {
    res.send("Title not specified!");
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
        } else {
          swimLaneModel.findMany(
            { _id: { $in: deleted.kanbanBoardSwimLanes } },
            function (err, docs) {
              if (err) {
                res.send(err);
              } else {
                for (let i = 0; i < docs.length; i++) {
                  taskModel.deleteMany(
                    { _id: { $in: docs[i].kanbanSwimLaneTasks } },
                    function (err) {
                      if (err) {
                        res.send(err);
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
              } else {
                res.send(
                  "Deleted successfully, deleted swimLanes: " +
                    deleted.kanbanBoardSwimLanes
                );
              }
            }
          );
        }
      }
    );
  } else {
    res.send("Title not specified!");
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
        } else {
          if (duplicate) {
            res.send("Such board already exists");
          }
        }
      }
    );

    const newKanbanBoard = new kanbanBoardModel({ kanbanBoardTitle: title });
    newKanbanBoard.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully created a new kanban board");
      }
    });
  } else {
    res.send("Title not specified, no board created!");
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
      }
    });

    kanbanBoardModel.findOneAndUpdate(
      { kanbanBoardTitle: kanbanBoardTitle },
      { $push: { kanbanBoardSwimLanes: newSwimLane._id } },
      { new: true },
      function (err, updatedBoard) {
        if (err) {
          res.send(err);
        } else {
          res.send(updatedBoard);
        }
      }
    );
  } else {
    if (kanbanBoardTitle) {
      res.send("SwimLane title not specified!");
    } else if (swimLaneTitle) {
      res.send("Kanban Board title not specified!");
    } else {
      res.send("Kanban board title and SwimLane title not specified!");
    }
  }
});

module.exports = router;

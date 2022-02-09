var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");

var swimLaneModel = require("../models/SwimLaneModel");

router.get("/listAllKanbanBoards", function (req, res, next) {
  kanbanBoardModel
    .find({})
    .populate({ path: "kanbanBoardSwimLane", model: "SwimLane" })
    .exec(function (err, boards) {
      if (err) {
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
      .populate({ path: "kanbanBoardSwimLane", model: "SwimLane" })
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

module.exports = router;

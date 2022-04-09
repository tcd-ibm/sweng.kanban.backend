var express = require("express");
var router = express.Router();

/*models*/

var kanbanBoardModel = require("../models/KanbanBoardModel");

var swimLaneModel = require("../models/SwimLaneModel");

var taskModel = require("../models/TaskModel");

router.get("/listAllTasks", function (req, res, next) {
  taskModel.find({}).exec(function (err, tasks) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      return res.send(tasks);
    }
  });
});

router.get("/listAllSwimLanes", function (req, res, next) {
  swimLaneModel
    .find({})
    .populate("kanbanSwimLaneTasks")
    .exec(function (err, swimLanes) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      } else {
        return res.send(swimLanes);
      }
    });
});

router.get("/listAllKanbanBoards", function (req, res, next) {
  kanbanBoardModel
    .find({})
    .populate({
      path: "kanbanBoardSwimLanes",
      populate: {
        path: "kanbanSwimLaneTasks",
        model: "Task",
      },
    })
    .exec(function (err, boards) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      } else {
        return res.send(boards);
      }
    });
});

router.get("/findKanbanBoardById", function (req, res, next) {
  const id = req.headers["id"];

  if (id) {
    kanbanBoardModel
      .findOne({ _id: id })
      .populate({
        path: "kanbanBoardSwimLanes",
        populate: {
          path: "kanbanSwimLaneTasks",
          model: "Task",
        },
      })
      .exec(function (err, board) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          if (board) {
            return res.send(board);
          } else {
            return res.sendStatus(404);
          }
        }
      });
  } else {
    return res.sendStatus(400);
  }
});

router.delete("/deleteKanbanBoardById", function (req, res, next) {
  const id = req.body.id;

  if (id) {
    kanbanBoardModel.findOneAndDelete(
      { _id: id },
      function (err, deleted) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else if (deleted) {
          swimLaneModel.find(
            { _id: { $in: deleted.kanbanBoardSwimLanes } },
            function (err, docs) {
              if (err) {
                console.log(err);
                return res.sendStatus(500);
              } else {
                let allTasks = [];

                for (let i = 0; i < docs.length; i++) {
                  allTasks = allTasks.concat(docs[i].kanbanSwimLaneTasks);
                }
                taskModel.deleteMany(
                  { _id: { $in: allTasks } },
                  function (err) {
                    if (err) {
                      console.log(err);
                      return res.sendStatus(500);
                    } else {
                      swimLaneModel.deleteMany(
                        { _id: { $in: deleted.kanbanBoardSwimLanes } },
                        function (err) {
                          if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                          } else {
                            return res.send("Deleted successfully");
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
          return res.sendStatus(404);
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
        console.log(err);
        return res.sendStatus(500);
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
  const kanbanBoardId = req.body.kanbanBoardId;

  if (swimLaneTitle && kanbanBoardId) {

    kanbanBoardModel.findOne(
      { _id: kanbanBoardId },
      function (err, board) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else if (board) {

          const newSwimLane = new swimLaneModel({
            swimLaneTitle: swimLaneTitle,
          });

          newSwimLane.save(function (err) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            } else {
              kanbanBoardModel.findOneAndUpdate(
                { _id: kanbanBoardId },
                { $push: { kanbanBoardSwimLanes: newSwimLane._id } },
                { new: true },
                function (err, updatedBoard) {
                  if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                  } else {
                    if (updatedBoard) {
                      return res.send(updatedBoard);
                    } else {
                      return res.sendStatus(404);
                    }
                  }
                }
              );
            }
          });
        } else {
          return res.sendStatus(404);
        }
      }
    );
  } else {
    return res.sendStatus(400);
  }
});

module.exports = router;

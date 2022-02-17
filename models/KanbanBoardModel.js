const mongoose = require('mongoose');

const kanbanBoard = new mongoose.Schema({
  kanbanBoardTitle: {
    type: String,
    required: true,
    unique: true
  },
  kanbanBoardSwimLanes: [{type: mongoose.Schema.Types.ObjectId, ref: 'SwimLane'}]
});

const modelKanbanBoard = mongoose.model('KanbanBoard',kanbanBoard);

module.exports = modelKanbanBoard;
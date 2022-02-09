const mongoose = require('mongoose');

const kanbanBoard = new mongoose.Schema({
  kanbanBoardTitle: {
    type: String,
    required: true,
    unique: true
  },
  kanbanBoardSwimLanes: [{type: mongoose.Schema.Types.ObjectId, ref: 'SwimLane'}]
});

module.exports = mongoose.model('KanbanBoard',kanbanBoard)
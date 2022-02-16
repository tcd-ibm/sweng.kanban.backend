const mongoose = require('mongoose');
const swimLane = new mongoose.Schema({
  swimLaneTitle: {
    type: String,
    required: true,
    unique:true 
  },

  kanbanSwimLaneTasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]

});

module.exports = mongoose.model('SwimLane', swimLane)
const mongoose = require('mongoose');
const swimLane = new mongoose.Schema({
  swimLaneTitle: {
    type: String,
    required: true,
  }
  /*Need to define an array of references to tasks here*/
});

module.exports = mongoose.model('SwimLane', swimLane)
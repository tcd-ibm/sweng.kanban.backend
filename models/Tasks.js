const mongoose = require('mongoose');

const task = new mongoose.Schema({
  taskTitle: {
    type: String,
    required: true,
  },
  taskDescription: {
      type: String,
      required: true,
  },
});

module.exports = mongoose.model('Task',task)
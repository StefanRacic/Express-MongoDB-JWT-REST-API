const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  type: {
    type: String,
    default: "personal"
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  dateFinished: {
    type: Date
  }
});

module.exports = mongoose.model("task", TaskSchema);

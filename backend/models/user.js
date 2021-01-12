const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
  totalWordsTyped: {
      type: Number,
      default: 0
  },
  totalTimeTyping: {
      type: Number,
      default: 0
  },
  totalFunctionsTyped: {
    type: Number,
    default: 0
  },
  totalClassesTyped: {
    type: Number,
    default: 0
  },
  totalRacesPlayed: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', user);

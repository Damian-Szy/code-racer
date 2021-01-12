const mongoose = require("mongoose");

const room = new mongoose.Schema({
//   _id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
  // players list, each player has a name, if the name is guest then there is no userId
  players: [
    {
      name: {
        type: String,
        required: false,
      },
      _id: {
        type: String,
        required: false,
      },
      speed: {
          type: Number,
          default: 0
      },
      wordsTyped: {
          type: Number,
          default: 0
      }
    },
  ],
  phrase: [
      {
          type: String
      }
  ],
  functions: {
      type: Number
  },
  classes: {
      type: Number
  }
});

module.exports = mongoose.model("Room", room);

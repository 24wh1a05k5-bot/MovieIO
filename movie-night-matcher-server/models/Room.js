const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    members: [
      {
        userId: String,
      },
    ],
    movieDeck: [Number],
    likes: {
      type: Map,
      of: [Number],
      default: {},
    },
    matches: [Number],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
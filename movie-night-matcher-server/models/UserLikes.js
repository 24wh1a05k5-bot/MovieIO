const mongoose = require("mongoose");

const UserLikesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  movies: {
    type: Map,
    of: {
      id: Number,
      title: String,
      poster: String,
      year: String,
      rating: Number,
      overview: String,
      roomCode: String,
      likedAt: Number,
    },
    default: {},
  },
});

module.exports = mongoose.model("UserLikes", UserLikesSchema);
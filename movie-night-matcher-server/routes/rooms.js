const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const Room = require("../models/Room");
const UserLikes = require("../models/UserLikes");

// Create a new room
router.post("/", async (req, res) => {
  try {
    const { movieDeck } = req.body;
    const code = nanoid(5).toUpperCase();
    const room = await Room.create({ code, movieDeck, members: [], likes: {}, matches: [] });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Get room details (used when someone tries to join with a code)
router.get("/:code", async (req, res) => {
  const room = await Room.findOne({ code: req.params.code.toUpperCase() });
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

// Get a user's liked movies (for the Dashboard page)
router.get("/likes/:userId", async (req, res) => {
  const record = await UserLikes.findOne({ userId: req.params.userId });
  if (!record) return res.json({ movies: {} });
  res.json({ movies: Object.fromEntries(record.movies) });
});

module.exports = router;
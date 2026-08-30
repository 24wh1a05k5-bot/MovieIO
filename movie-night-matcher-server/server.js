require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const roomRoutes = require("./routes/rooms");
const Room = require("./models/Room");
const UserLikes = require("./models/UserLikes");

const app = express();
app.use(cors({ origin: "*" })); // or your specific frontend URL once you have it
app.use(express.json());
app.use("/api/rooms", roomRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

io.on("connection", (socket) => {
  socket.on("join-room", async ({ roomCode, userId }) => {
    try {
      socket.join(roomCode);

      const existing = await Room.findOne({ code: roomCode });
      if (!existing) return;

      const alreadyMember = existing.members.some((m) => m.userId === userId);

      let room = existing;
      if (!alreadyMember) {
        room = await Room.findOneAndUpdate(
          { code: roomCode, "members.userId": { $ne: userId } },
          {
            $push: { members: { userId } },
            $set: { [`likes.${userId}`]: [] },
          },
          { new: true }
        );
        if (!room) {
          room = await Room.findOne({ code: roomCode });
        }
      }

      io.to(roomCode).emit("room-update", room);
    } catch (err) {
      console.error("join-room error:", err.message);
    }
  });

  socket.on("swipe", async ({ roomCode, userId, movie, liked }) => {
    try {
      if (!liked) {
        const room = await Room.findOne({ code: roomCode });
        io.to(roomCode).emit("room-update", room);
        return;
      }

      let room = await Room.findOneAndUpdate(
        { code: roomCode },
        { $addToSet: { [`likes.${userId}`]: movie.id } },
        { new: true }
      );
      if (!room) return;

      await UserLikes.findOneAndUpdate(
  { userId },
  {
    $set: {
      [`movies.${movie.id}`]: {
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
        rating: movie.rating,
        overview: movie.overview,
        roomCode: roomCode,
        likedAt: Date.now(),
      },
    },
  },
  { upsert: true }
);

      const everyoneLiked = room.members.every((m) =>
        (room.likes.get(m.userId) || []).includes(movie.id)
      );

      if (everyoneLiked && !room.matches.includes(movie.id)) {
        room = await Room.findOneAndUpdate(
          { code: roomCode, matches: { $ne: movie.id } },
          { $addToSet: { matches: movie.id } },
          { new: true }
        );
      }

      io.to(roomCode).emit("room-update", room);
    } catch (err) {
      console.error("swipe error:", err.message);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
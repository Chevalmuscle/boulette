module.exports = { playerListUpdate, turnUpdate };

const express = require("express");
const socket = require("socket.io");
const Game = require("./game");

const app = express();
const port = process.env.PORT || 3001;

const games = {};

/**
 * Delay before an empty game gets deleted (in ms)
 */
const GAME_DELETION_DELAY = 5 * 60 * 1000;

app.get("/", function (req, res) {
  res.send("Hello World!");
});

const server = app.listen(port, function () {
  console.log(`http://localhost:${port} 🐷`);
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("New connection " + socket.id);
  let room;

  socket.on("join-room", ({ roomid, playerName }) => {
    room = roomid;
    roomid = roomid.toLowerCase();
    if (games[roomid] === undefined) {
      // io.to(socket.id).emit("invalid-room-id", null);
      games[roomid] = new Game(roomid, 30000); //! 30000 is for dev purposes

      socket.join(roomid);
      games[roomid].addPlayer(socket.id, playerName);
    } else {
      socket.join(roomid);
      games[roomid].addPlayer(socket.id, playerName);
    }
    room = roomid;
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    if (room !== undefined) {
      games[room].removePlayer(socket.id);

      if (games[room].isEmpty()) {
        // adds a delay before deleting the game
        setTimeout(function () {
          if (games[room].isEmpty()) {
            delete games[room];
            console.log("Purged game with room " + room);
          }
        }, GAME_DELETION_DELAY);
      }
    }
  });

  socket.on("player-ready-state-update", (isReady) => {
    games[room].setPlayerReadyState(socket.id, isReady);
  });
});

function playerListUpdate(roomid, playerList) {
  io.in(roomid).emit("player-list", playerList);
}

function turnUpdate(roomid, currentPlayerid, word, turnLength) {}

module.exports = { playerListUpdate, turnUpdate, roundUpdate };

const express = require("express");
const socket = require("socket.io");
const Game = require("./Game");

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
      games[roomid] = new Game(roomid, 5000); //! 30000 is for dev purposes

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

    if (games[room].arePlayersReady()) {
      games[room].playNextTurn();
    }
  });

  socket.on("turn-end", () => {
    console.log("turn end");
    games[room].playNextTurn();
  });

  socket.on("guessed-word", (word) => {
    console.log("guess");
    games[room].removeWordToRound(word);
    io.to(socket.id).emit("new-word", games[room].getRandomWord());
  });

  socket.on("guessed-word-turn-end", ({ word, hasGuessed }) => {
    console.log("guess on end");
    if (hasGuessed === true) {
      games[room].removeWordToRound(word);
    }
  });
});

function playerListUpdate(roomid, playerList) {
  io.in(roomid).emit("player-list", playerList);
}

function turnUpdate(roomid, currentPlayerid, turnLength) {
  console.log("Turn update in room " + roomid);
  io.in(roomid).emit("new-turn", currentPlayerid);
  io.to(currentPlayerid).emit("new-word", games[roomid].getRandomWord());

  let timeLeft = turnLength;
  var turnCountDown = setInterval(function () {
    io.in(roomid).emit("counter", {
      timeLeft: timeLeft,
      totalTime: turnLength,
    });
    timeLeft -= 1000;
    if (timeLeft < 0) {
      clearInterval(turnCountDown);
      io.in(roomid).emit("times-up");
    }
  }, 1000);
}

function roundUpdate(roomid, roundIndex) {
  io.in(roomid).emit("new-round", roundIndex);
}

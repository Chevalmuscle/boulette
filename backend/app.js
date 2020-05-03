module.exports = { playerListUpdate, turnUpdate, roundUpdate };

const express = require("express");
const socket = require("socket.io");
const Game = require("./Game");

const app = express();
const port = process.env.PORT || 3001;

const games = {};
const ROOM_ID_LENGTH = 5;

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

  socket.on("request-new-room", ({ turnLength }) => {
    const roomid = generateRoomid(ROOM_ID_LENGTH);
    games[roomid] = new Game(
      roomid,
      turnLength * 1000, // convert from seconds to ms
    );
    io.to(socket.id).emit("new-room-id", roomid);
  });

  socket.on("request-game-list", () => {
    const cleanedGameList = Object.keys(games).map((roomid) => {
      return {
        roomid: games[roomid].roomid,
        players: games[roomid].players,
        currentRoundIndex: games[roomid].roundIndex,
      };
    });
    io.to(socket.id).emit("game-list", cleanedGameList);
  });

  socket.on("join-room", ({ roomid, playerName }) => {
    roomid = roomid.toLowerCase();
    if (games[roomid] === undefined) {
      io.to(socket.id).emit("invalid-room-id", null);
    } else {
      socket.join(roomid);
      games[roomid].addPlayer(socket.id, playerName);
      room = roomid;
    }
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

  socket.on("player-ready-to-start-update", ({ isReady, words }) => {
    games[room].setPlayerReadyState(socket.id, isReady);
    if (isReady) {
      games[room].addPlayersWords(socket.id, words);
    } else {
      games[room].removePlayersWords(socket.id);
    }

    if (games[room].arePlayersReady()) {
      games[room].playNextTurn();
    }
  });

  socket.on("guessed-word", (word) => {
    console.log("guess");
    games[room].removeWordToRound(word);
    io.to(socket.id).emit("new-word", games[room].getRandomWord());
  });

  socket.on("guessed-word-turn-end", ({ word, hasGuessed }) => {
    console.log("turn end");
    if (hasGuessed === true) {
      games[room].removeWordToRound(word);
    }
    games[room].playNextTurn();
  });
});

/**
 * Generates a new room id
 * Comes from https://stackoverflow.com/a/1349426
 */
function generateRoomid(roomidLength) {
  let isUnique = true;
  let roomid;

  do {
    roomid = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < roomidLength; i++) {
      roomid += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    isUnique = games[roomid] === undefined;
  } while (!isUnique);

  return roomid;
}

function playerListUpdate(roomid, playerList) {
  io.in(roomid).emit("player-list", playerList);
}

function turnUpdate(roomid, currentPlayerid, currentPlayerName, turnLength) {
  console.log("Turn update in room " + roomid);
  io.in(roomid).emit("new-turn", { currentPlayerid, currentPlayerName });
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

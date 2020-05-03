const Player = require("./Player");
const { playerListUpdate, turnUpdate, roundUpdate } = require("./app");

module.exports = class Game {
  constructor(roomid, turnLength) {
    /**
     * game's room's id
     */
    this.roomid = roomid;

    /**
     * List of the players in the game
     */
    this.players = [];

    /**
     * Index of the current player
     * in the players array
     */
    this.currentPlayerIndex = -1;

    /**
     * Words that can be used during the game
     */
    this.words = {};

    /**
     * Words that still do need to be guessed
     */
    this.wordsLeft = [];

    /**
     * Time per turn in ms
     */
    this.TURN_LENGTH = turnLength;

    /**
     * Counter for the rounds
     */
    this.roundIndex = 0;

    this.nextRound();
  }

  /**
   * Returns true if the game has no player
   */
  isEmpty() {
    return this.players.length === 0;
  }

  /**
   * Sets a ready state for the specified player
   * @param {string} playerid player's id
   * @param {boolean} isReady new ready state for the player
   */
  setPlayerReadyState(playerid, isReady) {
    this.players[
      this.players.findIndex((player) => player.id === playerid)
    ].setIsReady(isReady);
    playerListUpdate(this.roomid, this.players);
  }

  /**
   * Returns true if all the players are ready
   */
  arePlayersReady() {
    return this.players.every((player) => player.isReady === true);
  }

  /**
   * Return player's name by id
   * @param {string} playerid id of the player
   */
  getPlayerName(playerid) {
    const playerIndex = this.players.findIndex(
      (player) => player.id === playerid,
    );
    return this.players.slice(playerIndex, playerIndex + 1)[0].name;
  }

  /**
   * Adds a player to the game
   * @param {string} playerid player's id
   * @param {string} name player's name
   */
  addPlayer(playerid, name) {
    this.players.push(new Player(playerid, name));
    playerListUpdate(this.roomid, this.players);
  }

  /**
   * Removes player from the game by id
   * @param {string} playerid  id of the player
   */
  removePlayer(playerid) {
    this.players.splice(
      this.players.findIndex((player) => player.id === playerid),
      1,
    );
    playerListUpdate(this.roomid, this.players);
  }

  addPlayersWords(playerid, words) {
    this.words[playerid] = words;
  }

  removePlayersWords(playerid) {
    this.words[playerid] = [];
  }

  getWords() {
    let words = [];
    for (let playerid in this.words) {
      words = words.concat(this.words[playerid]);
    }
    return words;
  }

  /**
   * Removes a word from the round
   * @param {string} word word to be removed
   */
  removeWordToRound(word) {
    this.wordsLeft.splice(this.wordsLeft.indexOf(word), 1);
    console.table(this.wordsLeft);
  }

  nextRound() {
    this.wordsLeft = this.getWords();
    this.currentPlayerIndex = -1;
    this.roundIndex++;
    roundUpdate(this.roomid, this.roundIndex);
  }

  /**
   * Plays the next turn in the round
   *
   * Checks if the round is over before starting the turn
   *
   * Returns true if the next turn is beeing played
   * Returns false if there's no more turn to player and a new round is starting
   */
  playNextTurn() {
    // checks if the round is over
    if (this.wordsLeft.length <= 0) {
      this.nextRound();
      return;
    }

    // sets next player
    if (++this.currentPlayerIndex > this.players.length - 1)
      this.currentPlayerIndex = 0;

    turnUpdate(
      this.roomid,
      this.players[this.currentPlayerIndex].id,
      this.TURN_LENGTH,
    );
  }

  /**
   * Returns a random word from the list of words in the round
   */
  getRandomWord() {
    return this.wordsLeft[Math.floor(Math.random() * this.wordsLeft.length)];
  }
};

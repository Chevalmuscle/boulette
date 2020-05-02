const Player = require("./Player");
const { playerListUpdate, turnUpdate } = require("./app");

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
    this.words;

    /**
     * Words that still do need to be guessed
     */
    this.wordsLeft;

    /**
     * Time per turn in ms
     */
    this.TURN_LENGTH = turnLength;
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
    this.players
      .findIndex((player) => player.id === playerid)
      .setIsReady(isReady);
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

  /**
   * Removes a word from the round
   * @param {string} word word to be removed
   */
  removeWordToRound(word) {
    this.wordsLeft.splice(this.wordsLeft.findIndex(word), 1);
  }

  nextRound() {
    this.wordsLeft = this.words;
    this.currentPlayerIndex = -1;

    //TODO Notify the server of a new round
  }

  /**
   * Adds the words in the game
   * @param {string[]} words list of the words to be used in the games
   */
  addWords(words) {
    this.words = words;
  }

  /**
   * Plays the next turn in the round
   *
   * Checks if the round is over before starting the turn
   */
  playTurn() {
    // checks if the round is over
    if (++this.currentPlayerIndex > this.players.length - 1) {
      this.nextRound();
      return;
    }

    const currentWord = this.getRandomWord();

    turnUpdate(
      this.roomid,
      this.players[this.currentPlayerIndex].id,
      currentWord,
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

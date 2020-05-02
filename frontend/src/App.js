import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const SOCKETIO_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
      isReady: false,
      word: undefined,
      timeLeft: undefined,
      timeIsOver: false,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.toggleReadyState = this.toggleReadyState.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.guessedWord = this.guessedWord.bind(this);
    this.guessWordTurnEnd = this.guessWordTurnEnd.bind(this);
  }

  componentDidMount() {
    const socket = socketIOClient(SOCKETIO_ENDPOINT);

    socket.emit("join-room", { roomid: "1", playerName: "bob" });

    socket.on("player-list", (playerList) => {
      console.table(playerList);
    });

    socket.on("new-round", (roundIndex) => {
      console.log("new round " + roundIndex);
      this.setState({ isReady: false });
    });

    socket.on("new-turn", (currentPlayerid) => {
      console.log(currentPlayerid);
      this.setState({ timeIsOver: false });
    });

    socket.on("new-word", (word) => {
      console.log(word);
      this.setState({ word: word });
    });

    socket.on("counter", ({ timeLeft, totalTime }) => {
      console.log(timeLeft + " / " + totalTime);
      this.setState({ timeLeft: timeLeft });
    });

    socket.on("times-up", () => {
      console.log("time's up");
      this.setState({ timeIsOver: true });
    });

    this.setState({ socket });
  }

  toggleReadyState() {
    this.state.socket.emit("player-ready-state-update", !this.state.isReady);
    this.setState({ isReady: !this.state.isReady });
  }

  endTurn() {
    this.state.socket.emit("turn-end");
  }

  guessedWord() {
    this.state.socket.emit("guessed-word", this.state.word);
    this.setState({ word: undefined });
  }

  guessWordTurnEnd(hasGuessed) {
    this.state.socket.emit("guessed-word-turn-end", {
      word: this.state.word,
      hasGuessed: hasGuessed,
    });
    this.state.socket.emit("turn-end");
  }

  render() {
    return (
      <div>
        Hello world !
        <button onClick={this.toggleReadyState}>
          {this.state.isReady ? "Unready" : "Ready"}
        </button>
        <button onClick={this.endTurn}>End Turn</button>
        <button onClick={this.guessedWord}>Guessed word</button>
        {this.state.timeIsOver && (
          <div>
            <button onClick={() => this.guessWordTurnEnd(false)}>fail</button>
            <button onClick={() => this.guessWordTurnEnd(true)}>success</button>
          </div>
        )}
      </div>
    );
  }
}

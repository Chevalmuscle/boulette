import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import Play from "./pages/Play";
import Spectate from "./pages/Spectate";
import RoundStart from "./pages/RoundStart";
import ProgressBar from "./components/ProgressBar";

import styles from "./App.module.css";

const SOCKETIO_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
      playerid: undefined,
      isReady: false,
      word: undefined,
      totalTime: undefined,
      timeLeft: undefined,
      timeIsOver: false,

      gameState: "round",
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.toggleReadyState = this.toggleReadyState.bind(this);
    this.handleRoundStart = this.handleRoundStart.bind(this);
    this.handleGuessed = this.handleGuessed.bind(this);
    this.handleFailed = this.handleFailed.bind(this);
    this.gameStart = this.gameStart.bind(this);
  }

  componentDidMount() {
    const roomid = new URLSearchParams(this.props.location.search).get("room");

    if (roomid === null) {
      this.props.history.push("/");
      return;
    }
    const socket = socketIOClient(SOCKETIO_ENDPOINT);
    socket.on("connect", () => this.setState({ playerid: socket.id }));

    socket.emit("join-room", { roomid: roomid, playerName: "bob" });

    socket.on("player-list", (playerList) => {
      console.table(playerList);
    });

    socket.on("new-round", (roundIndex) => {
      console.log("new round " + roundIndex);
      this.setState({ gameState: "round", isReady: false });
    });

    socket.on("new-turn", (currentPlayerid) => {
      console.log(currentPlayerid);
      this.setState({ timeIsOver: false });
      this.gameStart(currentPlayerid);
    });

    socket.on("new-word", (word) => {
      console.log(word);
      this.setState({ word: word });
    });

    socket.on("counter", ({ timeLeft, totalTime }) => {
      console.log(timeLeft + " / " + totalTime);
      this.setState({ timeLeft: timeLeft, totalTime: totalTime });
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

  gameStart(currentPlayerid) {
    if (currentPlayerid === this.state.playerid) {
      // the player is playing
      this.setState({ timeIsOver: false, gameState: "playing" });
    } else {
      // the player is spectating
      this.setState({ gameState: "spectating" });
    }
  }

  handleRoundStart(e) {
    e.preventDefault();
    this.state.socket.emit("turn-end");
  }

  handleGuessed(e) {
    e.preventDefault();
    if (this.state.timeIsOver) {
      this.state.socket.emit("guessed-word-turn-end", {
        word: this.state.word,
        hasGuessed: true,
      });
      this.state.socket.emit("turn-end");
    } else {
      this.state.socket.emit("guessed-word", this.state.word);
    }
    this.setState({ word: undefined });
  }

  handleFailed(e) {
    e.preventDefault();
    this.state.socket.emit("guessed-word-turn-end", {
      word: this.state.word,
      hasGuessed: false,
    });
    this.state.socket.emit("turn-end");
  }

  render() {
    const gameState = (() => {
      switch (this.state.gameState) {
        case "round":
          return (
            <RoundStart
              handleStart={this.handleRoundStart}
              explanationText={"Vous devez expliquer le mot qui sera affiché"}
            />
          );
        case "playing":
          return (
            <Play
              title={"Ronde 1: Explications"}
              playZoneText={this.state.word}
              handleGuessed={this.handleGuessed}
              handleFailed={this.handleFailed}
              end={this.state.timeIsOver}
            />
          );
        case "spectating":
          return <Spectate playZoneText={"(Tour de Bob Gratton)"} />;
        default:
          return <div>{`game state: ${gameState}`}</div>;
      }
    })();
    return (
      <div className={styles["container"]}>
        <h1>Ronde 1: Explications</h1>
        <div className={styles["content-container"]}>
          <div className={styles["my_content"]}>{gameState}</div>
          <div className={styles["push"]}></div>
        </div>
        <div className={styles["footer"]}>
          <div className={styles["progress-bar"]}>
            <ProgressBar percentage={(this.state.timeLeft / this.state.totalTime) * 100} />
          </div>
        </div>
      </div>
    );
  }
}

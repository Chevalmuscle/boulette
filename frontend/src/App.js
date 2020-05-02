import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const SOCKETIO_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: undefined,
      isReady: false,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.toggleReadyState = this.toggleReadyState.bind(this);
    this.endTurn = this.endTurn.bind(this);
  }

  componentDidMount() {
    const socket = socketIOClient(SOCKETIO_ENDPOINT);

    socket.emit("join-room", { roomid: "1", playerName: "bob" });

    socket.on("player-list", (playerList) => {
      console.table(playerList);
    });

    socket.on("new-round", (roundIndex) => {
      console.log("new round " + roundIndex);
    });

    socket.on("new-turn", ({ currentPlayerid, word }) => {
      console.log(currentPlayerid + " " + word);
    });

    socket.on("counter", ({ timeLeft, totalTime }) => {
      console.log(timeLeft + " / " + totalTime);
    });

    socket.on("times-up", () => {
      console.log("time's up");
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

  render() {
    return (
      <div>
        Hello world !
        <button onClick={this.toggleReadyState}>
          {this.state.isReady ? "Unready" : "Ready"}
        </button>
        <button onClick={this.endTurn}>End Turn</button>
      </div>
    );
  }
}

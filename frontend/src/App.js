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
  }

  componentDidMount() {
    const socket = socketIOClient(SOCKETIO_ENDPOINT);

    socket.emit("join-room", { roomid: "1", playerName: "bob" });

    socket.on("player-list", (playerList) => {
      console.table(playerList);
    });

    socket.on("new-turn", ({ currentPlayerid, word }) => {
      console.log(currentPlayerid + " " + word);
    });

    socket.on("counter", ({ timeLeft, totalTime }) => {
      console.log(timeLeft + " / " + totalTime);
    });

    this.setState({ socket });
  }

  toggleReadyState() {
    this.state.socket.emit("player-ready-state-update", !this.state.isReady);
    this.setState({ isReady: !this.state.isReady });
  }

  render() {
    return (
      <div>
        Hello world !
        <button onClick={this.toggleReadyState}>
          {this.state.isReady ? "Unready" : "Ready"}
        </button>
      </div>
    );
  }
}

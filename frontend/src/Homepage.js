import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import { SOCKETIO_ENDPOINT } from "./config";

import styles from "./Homepage.css";

const turnLengths = [20, 30, 45, 60, 90, 120, 150, 180, 210, 240];

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = { socket: undefined, turnLength: "30" };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleGenerateGame = this.handleGenerateGame.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    const socket = socketIOClient(SOCKETIO_ENDPOINT);

    socket.on("new-room-id", (roomid) => {
      this.props.history.push(`/game?room=${roomid}`);
      return;
    });

    this.setState({ socket });
  }

  handleGenerateGame(e) {
    e.preventDefault();
    const gameData = { turnLength: parseInt(this.state.turnLength) };
    this.state.socket.emit("request-new-room", gameData);
  }

  handleOnChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>La boulette !</h1>
        <div>
          <div>
            Turn length (in seconds):
            <select onChange={this.handleOnChange} name="turnLength" value={this.state.turnLength}>
              {turnLengths.map((turnLength) => {
                return <option value={turnLength}>{turnLength}</option>;
              })}
            </select>
          </div>
          <button onClick={this.handleGenerateGame}>Generate game</button>
        </div>
      </div>
    );
  }
}

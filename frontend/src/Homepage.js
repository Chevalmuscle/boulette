import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import { SOCKETIO_ENDPOINT } from "./config";

import styles from "./Homepage.css";

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
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
              <option value="90">90</option>
              <option value="120">120</option>
              <option value="150">150</option>
              <option value="180">180</option>
              <option value="210">210</option>
              <option value="240">240</option>
            </select>
          </div>
          <button onClick={this.handleGenerateGame}>Generate game</button>
        </div>
      </div>
    );
  }
}

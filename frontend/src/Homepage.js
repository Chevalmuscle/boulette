import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import { SOCKETIO_ENDPOINT } from "./config";

import styles from "./Homepage.module.css";

const turnLengthOptions = [20, 30, 45, 60, 90, 120, 150, 180, 210, 240];

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = { socket: undefined, gameList: [], turnLength: "30" };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.handleGenerateGame = this.handleGenerateGame.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidMount() {
    const socket = socketIOClient(SOCKETIO_ENDPOINT);

    socket.emit("request-game-list");

    socket.on("game-list", (gameList) => {
      this.setState({ gameList: gameList });
    });

    socket.on("new-room-id", (roomid) => {
      this.joinRoom(roomid);
      return;
    });

    this.setState({ socket });
  }

  joinRoom(roomid) {
    this.props.history.push(`/game?room=${roomid}`);
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
              {turnLengthOptions.map((turnLengthOption, i) => {
                return (
                  <option key={i} value={turnLengthOption}>
                    {turnLengthOption}
                  </option>
                );
              })}
            </select>
          </div>
          <button onClick={this.handleGenerateGame}>Generate game</button>
        </div>
        <div>
          {this.state.gameList.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Roomid</th>
                  <th>Players</th>
                  <th>Current Round</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.state.gameList.map((game) => {
                  return (
                    <tr key={game.roomid}>
                      <td>{game.roomid}</td>
                      <td>
                        <ul>
                          {game.players.map((player) => (
                            <li key={player.id}>{player.name}</li>
                          ))}
                        </ul>
                      </td>
                      <td>{game.currentRoundIndex}</td>
                      <td>
                        <button onClick={() => this.joinRoom(game.roomid)}>Join</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

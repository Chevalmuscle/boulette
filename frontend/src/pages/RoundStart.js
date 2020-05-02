import React, { Component } from "react";

import ProgressBar from "../components/ProgressBar";

import "./RoundStart.css";

export default class RoundStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
    };
  }

  render() {
    return (
      <div className="game-page">
        <h1>Ronde 1: Explications</h1>
        <div className="play-zone">
          <p>Jean-Marles</p>
        </div>
        <div className="start-button-wrapper">
          <button className="start-button">Commencer</button>
        </div>
        <ProgressBar className="progress-bar" percentage={this.state.percentage} />
      </div>
    );
  }
}

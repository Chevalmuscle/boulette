import React, { Component } from "react";

import Play from "./pages/Play";

import ProgressBar from "./components/ProgressBar";
import styles from "./Components.module.css";

export default class Components extends Component {
  constructor(props) {
    super(props);
    this.state = { percentage: 100, timesup: false };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleGuessed = this.handleGuessed.bind(this);
    this.handleFailed = this.handleFailed.bind(this);
  }

  componentDidMount() {
    let self = this;
    setInterval(function () {
      self.setState({ percentage: self.state.percentage - 50 });
      if (self.state.percentage <= 0) {
        self.setState({ timesup: true });
      }
    }, 1000);
  }

  handleGuessed(e) {
    e.preventDefault();
    console.log("guessed");
  }

  handleFailed(e) {
    e.preventDefault();
    console.log("failed");
  }

  render() {
    return (
      <div class={styles["container"]}>
        <h1>Ronde 1: Explications</h1>
        <div className={styles["content-container"]}>
          <div class={styles["my_content"]}>
            <Play
              title={"Ronde 1: Explications"}
              playZoneText={"Jean-Marles"}
              handleGuessed={this.handleGuessed}
              handleFailed={this.handleFailed}
              end={this.state.timesup}
              timesup={this.state.timesup}
            />
          </div>
          <div class={styles["push"]}></div>
        </div>
        <div class={styles["footer"]}>
          <div className={styles["progress-bar"]}>
            <ProgressBar percentage={this.state.percentage} />
          </div>
        </div>
      </div>
    );
  }
}

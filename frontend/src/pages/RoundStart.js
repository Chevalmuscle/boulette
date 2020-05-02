import React, { Component } from "react";

import ProgressBar from "../components/ProgressBar";

import styles from "./RoundStart.module.css";

export default class RoundStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
    };
  }

  render() {
    return (
      <div className={styles["game-page"]}>
        <h1>Ronde 1: Explications</h1>
        <div className={styles["play-zone"]}>
          <p>Jean-Marles</p>
        </div>
        <div className={styles["start-button-wrapper"]}>
          <button className={styles["start-button"]}>Commencer</button>
        </div>
        <div className={styles["progress-bar"]}>
          <ProgressBar percentage={this.state.percentage} />
        </div>
      </div>
    );
  }
}

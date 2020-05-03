import React, { Component } from "react";

import styles from "./Spectate.module.css";

export default class Spectate extends Component {
  render() {
    return (
      <div className={styles["game-page"]}>
        <div className={styles["play-zone"]}>
          <div className={styles["game-text"]}>{this.props.playZoneText}</div>
          <div className={styles["push"]}></div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";

import styles from "./RoundStart.module.css";

export default class RoundStart extends Component {
  constructor(props) {
    super(props);
    this.state = { isReadyButtonText: "Not Ready" };
  }

  onMouseover(e) {
    this.setState({ isReadyButtonText: this.props.isReady ? "Not Ready?" : "Get Ready?" });
  }

  onMouseout() {
    this.setState({ isReadyButtonText: this.props.isReady ? "Ready" : "Not Ready" });
  }

  render() {
    return (
      <div className={styles["game-page"]}>
        <div className={`${this.props.end && styles["hide"]} ${styles["play-zone"]}`}>
          <div className={styles["game-text"]}>{this.props.explanationText}</div>
          <div className={styles["push"]}></div>
        </div>
        <section className={styles["footer"]}>
          <div className={styles["start-button-wrapper"]}>
            <button
              onMouseEnter={this.onMouseover.bind(this)}
              onMouseLeave={this.onMouseout.bind(this)}
              onClick={this.props.handleStart}
              className={`${styles["button"]} ${
                this.props.isReady ? styles["is-ready-button"] : styles["is-not-ready-button"]
              }`}
            >
              {this.state.isReadyButtonText}
            </button>
          </div>
        </section>
      </div>
    );
  }
}

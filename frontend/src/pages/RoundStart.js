import React, { Component } from "react";

import styles from "./RoundStart.module.css";

export default class RoundStart extends Component {
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
              onClick={this.props.handleStart}
              id={this.props.isReady ? styles["get-not-ready-button"] : styles["get-ready-button"]}
              className={styles["button"]}
            >
              {this.props.isReady ? "Pas prêt" : "Prêt"}
            </button>
          </div>
        </section>
      </div>
    );
  }
}

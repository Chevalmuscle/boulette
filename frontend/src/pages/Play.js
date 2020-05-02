import React, { Component } from "react";

import ProgressBar from "../components/ProgressBar";

import styles from "./Play.module.css";

export default class Play extends Component {
  render() {
    return (
      <div className={styles["game-page"]}>
        <h1>{this.props.title}</h1>
        <div className={`${this.props.end && styles["hide"]} ${styles["play-zone"]}`}>
          <p>{this.props.playZoneText}</p>
        </div>
        <div>
          {this.props.end && (
            <div className={styles["fail-button-wrapper"]}>
              <button onClick={this.props.handleFailed} id={styles["fail-button"]} className={styles["button"]}>
                Fail
              </button>
            </div>
          )}
          <div
            className={`${this.props.end && styles["guessed-button-wrapper-end"]} ${styles["guessed-button-wrapper"]}`}
          >
            <button onClick={this.props.handleGuessed} id={styles["guessed-button"]} className={styles["button"]}>
              Deviné
            </button>
          </div>
        </div>

        <div className={styles["progress-bar"]}>
          <ProgressBar percentage={this.props.percentage} />
        </div>
      </div>
    );
  }
}

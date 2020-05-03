import React, { Component } from "react";

import styles from "./Play.module.css";

export default class Play extends Component {
  render() {
    return (
      <div className={styles["game-page"]}>
        <div className={`${this.props.end && styles["hide"]} ${styles["play-zone"]}`}>
          <div className={styles["game-text"]}>{this.props.playZoneText}</div>
          <div className={styles["push"]}></div>
        </div>
        <section className={styles["footer"]}>
          {this.props.end && (
            <div className={styles["fail-button-wrapper"]}>
              <button onClick={this.props.handleFailed} id={styles["fail-button"]} className={styles["button"]}>
                Fail
              </button>
            </div>
          )}
          <div className={styles["guessed-button-wrapper"]}>
            <button onClick={this.props.handleGuessed} id={styles["guessed-button"]} className={styles["button"]}>
              Deviné
            </button>
          </div>
        </section>
      </div>
    );
  }
}

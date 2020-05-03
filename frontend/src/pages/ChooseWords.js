import React, { Component } from "react";

import WordsForm from "../components/WordsForm";

import "./ChooseWords.css";

export default class ChooseWords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
    this.handleSubmitWords = this.handleSubmitWords.bind(this);
  }

  handleSubmitWords(words) {
    this.props.handleSubmitWords(!this.state.isReady, words);
    this.setState({ isReady: !this.state.isReady });
  }

  render() {
    return (
      <div id="choose-words">
        <div>
          <h1 id="title">Propose 5 mots !</h1>
          <WordsForm
            handleSubmit={this.handleSubmitWords}
            className={`word-form ${this.state.isReady ? "ready-state" : "not-ready-state"}`}
            isReady={this.state.isReady}
          />
        </div>
        <div>
          <h2 id="player-title">Joueurs</h2>
          <ul>
            {this.props.players.map((player) => {
              return (
                <li key={player.id} className={player.isReady ? "ready-state" : "not-ready-state"}>
                  {player.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

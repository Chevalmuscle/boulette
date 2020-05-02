import React, { Component } from "react";

import WordsForm from "../components/WordsForm";

import "./ChooseWords.css";

export default class ChooseWords extends Component {
  render() {
    return (
      <div id="choose-words">
        <div>
          <h1 id="title">Propose 5 mots !</h1>
          <WordsForm className="word-form" isReady={false} />
        </div>
        <div>
          <h2 id="player-title">Joueurs</h2>
          <ul>
            <li>Joueur 1</li>
            <li>Joueur 2</li>
            <li>Joueur 3</li>
            <li>Joueur 4</li>
            <li>Joueur 5</li>
          </ul>
        </div>
      </div>
    );
  }
}

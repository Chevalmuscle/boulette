import React, { Component } from "react";

import "./WordsForm.css";

const WORD_COUNT = 5;

export default class WordsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word1: undefined,
      word2: undefined,
      word3: undefined,
      word4: undefined,
      word5: undefined,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.handleSubmit([this.state.word1, this.state.word2, this.state.word3, this.state.word4, this.state.word5]);
  }

  renderInputs() {
    const inputs = [];

    for (let i = 0; i < WORD_COUNT; i++) {
      inputs.push(
        <input
          key={`word-input-${i}`}
          disabled={this.props.isReady}
          className="input"
          name={`word${i}`}
          onChange={this.handleInputChange}
          required
          type="text"
          placeholder="Word"
        />,
      );
    }
    return inputs;
  }

  render() {
    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
        {this.renderInputs()}
        <button className="ready-button" type="submit">
          {this.props.isReady ? "Not Ready" : "Ready"}
        </button>
      </form>
    );
  }
}

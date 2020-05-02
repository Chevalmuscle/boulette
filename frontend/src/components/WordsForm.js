import React, { Component } from "react";

import "./WordsForm.css";

export default class WordsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word1: undefined,
      word2: undefined,
      word3: undefined,
      word4: undefined,
      word5: undefined,
      validated: false,
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
    event.stopPropagation();

    if (event.currentTarget.checkValidity() === true) {
      this.props.handleSubmit([
        this.state.word1,
        this.state.word2,
        this.state.word3,
        this.state.word4,
        this.state.word5,
      ]);
    }
    this.setState({ validated: true });
  }

  render() {
    return (
      <form className={this.props.className} noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
        <input className="input" name="word1" onChange={this.handleInputChange} required type="text" placeholder="Word" />
        <input className="input" name="word2" onChange={this.handleInputChange} required type="text" placeholder="Word" />
        <input className="input" name="word3" onChange={this.handleInputChange} required type="text" placeholder="Word" />
        <input className="input" name="word4" onChange={this.handleInputChange} required type="text" placeholder="Word" />
        <input className="input" name="word5" onChange={this.handleInputChange} required type="text" placeholder="Word" />
        <button className="ready-button" type="submit">{this.props.isReady? "Not Ready": "Ready"}</button>
      </form>
    );
  }
}

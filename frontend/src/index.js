import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";

import App from "./App";
import Components from "./Components";
import ChooseWords from "./pages/ChooseWords";
import RoundStart from "./pages/RoundStart";

import "./index.css";

const routing = (
  <Router>
      <Route exact path="/" component={App} />
      <Route exact path="/components" component={Components} />
      <Route exact path="/choose-words" component={ChooseWords} />
      <Route exact path="/play" component={RoundStart} />

  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

serviceWorker.unregister();

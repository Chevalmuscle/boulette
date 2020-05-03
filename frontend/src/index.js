import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Homepage from "./Homepage";
import App from "./App";

import "./index.css";

const routing = (
  <Router>
    <Route exact path="/" component={Homepage} />
    <Route exact path="/game" component={App} />
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

serviceWorker.unregister();

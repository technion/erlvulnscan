import * as React from "react";
import * as ReactDOM from "react-dom";

import { NetscanBox } from "./erlvulnscan";

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <NetscanBox />
      );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("content"),
);

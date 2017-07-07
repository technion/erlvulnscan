import { MuiThemeProvider } from "material-ui/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { NetscanBox } from "./erlvulnscan";

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <MuiThemeProvider>
        <NetscanBox />
      </MuiThemeProvider>
      );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("content"),
);

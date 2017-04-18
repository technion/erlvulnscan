import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as injectTapEventPlugin from "react-tap-event-plugin";

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

injectTapEventPlugin();

ReactDOM.render(
  <App />,
  document.getElementById("content"),
);

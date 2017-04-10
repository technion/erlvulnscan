import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as injectTapEventPlugin from "react-tap-event-plugin";

import NetscanBox from "./erlvulnscan.tsx";

const App = () => (
  <MuiThemeProvider>
    <NetscanBox />
  </MuiThemeProvider>
);

injectTapEventPlugin();

ReactDOM.render(

  <App />,
  document.getElementById("content")
);

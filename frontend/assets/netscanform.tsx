import { I_NetScan } from "./interfaces.d.ts";

import { createStyleSheet } from "jss-theme-reactor";
import {
  List,
    ListItem,
    ListItemText,
} from "material-ui/List";
import customPropTypes from "material-ui/utils/customPropTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";

interface I_NetScanList {
  data: I_NetScan[];
}

declare class Recaptcha {
  public getResponse(): string;
}

declare const grecaptcha: Recaptcha;

export class NetscanList extends React.Component<I_NetScanList, {}> {
  public render() {
    "use strict";
    const commentNodes = this.props.data.map(
        (comment: I_NetScan, index: number) =>
          <IPResult address={comment.address} key={index}>
          {comment.stat}
          </IPResult>,
        );
    return (
        <div><List>
          {commentNodes}
        </List></div>
        );
  }
}

interface I_IPResult extends React.Props<IPResult> {
  address: string;
}

class IPResult extends React.Component<I_IPResult, {}> {
  public render() {
    "use strict";
    const styleSheet = createStyleSheet("IPResult", () => ({
      red: {
        backgroundColor: "#f2dede",
        color: "#a94442",
        borderColor: "#ebccd1",
        border: "1px solid transparent",
      },
      green: {
        backgroundColor: "#dff0d8",
        color: "#3c763d",
        borderColor: "#d6e9c6",
        border: "1px solid transparent",
      },
      blue: {
        color: "#31708f",
        backgroundColor: "#d9edf7",
        borderColor: "#bce8f1",
        border: "1px solid transparent",
      },
      }),
    );
    let ipstate: string;
    const classes = this.context.styleManager.render(styleSheet);
    if (this.props.children === "vulnerable") {
      ipstate = classes.red;
    } else if (this.props.children === "not_vulnerable") {
      ipstate = classes.green;
    } else {
      ipstate = classes.blue; // No connect state
    }
    const result: string = this.props.address + " " + this.props.children;
    return (
      <ListItem button>
        <ListItemText primary={result} className={ipstate} />
      </ListItem>
      );
  }
}

IPResult.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};

interface I_NetScanForm {
  onNetscanSubmit: (network: string) => void;
  setModal: (text: string) => void;
  show: boolean;
}

export class NetscanForm extends React.Component<I_NetScanForm, {}> {
  public handleSubmit(e) {
    "use strict";
    e.preventDefault();
    const netnode = ReactDOM.findDOMNode<HTMLInputElement>(this.refs["network"]);
    const network: string = netnode.value.trim();
    if (!network) {
      this.props.setModal("Please supply a valid network address in the form x.x.x.0");
      return;
    }
    const re = /^\d+\.\d+\.\d+\.0$/; // IP Address match. Not a complete verifier - will be strictly handled server side
    if (!network.match(re)) {
      this.props.setModal("Please supply a valid network address in the form x.x.x.0");
      return;
    }
    const recaptcha = grecaptcha.getResponse();
    if (recaptcha.length === 0) {
      this.props.setModal("Captcha");
      return;
    }

    this.props.onNetscanSubmit(network);
    netnode.value = "";
    return;
  }
  public render() {
    "use strict";
    if (this.props.show === false) {
      return(null);
    }
    return (
        <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="127.0.0.0" ref="network" />
        <input type="submit" value="Post" />
        </form>
        );
  }
}

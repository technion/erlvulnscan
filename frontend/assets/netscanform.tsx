import * as React from "react";
import * as ReactDOM from "react-dom";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment";

import { I_NetScan } from "./interfaces";

import {
  SecureSVG,
  ErrorSVG,
  ReportSVG,
} from "./images";

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
        <div>
          {commentNodes}
        </div>
        );
  }
}

interface I_IPResult extends React.Props<IPResult> {
  address: string;
}

class IPResult extends React.Component<I_IPResult, {}> {
  public render() {
    let ipstate: "red" | "green" | "blue";
    let image;
    if (this.props.children === "vulnerable") {
      ipstate = "red";
      image = <ReportSVG />;
    } else if (this.props.children === "not_vulnerable") {
      ipstate = "green";
      image = <SecureSVG />;
    } else {
      ipstate = "blue"; // No connect state
      image = <ErrorSVG />;
    }
    const result: string = this.props.address + "\u00A0\u00A0"
        + this.props.children;
    return (
      <Segment inverted color={ipstate} textAlign="center">
      <Header as="h3">
        {image}
        <Header.Content as="span">
        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
        {this.props.address}
        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
        {this.props.children}
        </Header.Content>
      </Header>
      </Segment>
      );
  }
}

interface I_NetScanForm {
  onNetscanSubmit: (network: string, recaptcha: string) => void;
  setModal: (text: string) => void;
  show: boolean;
}

export class NetscanForm extends React.Component<I_NetScanForm, {}> {
  constructor(props: I_NetScanForm) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleSubmit(e: any) {
    "use strict";
    e.preventDefault();
    const network: string = e.target.network.value.trim();
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
      this.props.setModal("Please complete Captcha");
      return;
    }

    this.props.onNetscanSubmit(network, recaptcha);
  }
  public render() {
    "use strict";
    if (this.props.show === false) {
      return(null);
    }
    return (
      <span>
      <form onSubmit={this.handleSubmit}>
      <input type="text" name="network" />
      <input type="submit" value="Post" />
      </form>
      <div className="g-recaptcha container"
        data-sitekey="6LccrB0UAAAAAMXhOZxEg6LJ8F2NR-Y-8NFWlDiS"></div>
      </span>
      );
  }
}

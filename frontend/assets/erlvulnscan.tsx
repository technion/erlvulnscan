import * as React from "react";
import * as ReactDOM from "react-dom";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

interface I_NetScan {
    stat: string;
    address: string;
}

interface I_NetScanList {
    data: Array<I_NetScan>;
}

declare class Recaptcha {
    getResponse(): string;
}

declare var grecaptcha: Recaptcha;


class NetscanList extends React.Component<I_NetScanList, any> {
   public render() {
   "use strict";
   const commentNodes = this.props.data.map(
           (comment: I_NetScan, index: number) =>
              <IPResult address={comment.address} key={index}>
              {comment.stat}
              </IPResult>
    );
    return (
      <div>
        {commentNodes}
      </div>
    );
  }
};

interface I_IPResult extends React.Props<IPResult> {
      address: string;
}


class IPResult extends React.Component<I_IPResult, any> {
    public render() {
        "use strict";
        let ipstate: string;
        if (this.props.children === "vulnerable") {
            ipstate = "alert alert-danger";
        } else if (this.props.children === "not_vulnerable") {
            ipstate = "alert alert-success";
        } else {
            ipstate = "alert alert-info"; // No connect state
        }

        return (
            <div className={ipstate} role="alert">
            {this.props.address} {this.props.children}</div>
        );
    }
};

interface I_NetScanForm {
    onNetscanSubmit: (network: string) => void;
    setModal: (text: string) => void;
    show: boolean;
}

class NetscanForm extends React.Component<I_NetScanForm, any> {
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
};

class NetscanBox extends React.Component<any, any> {
      "use strict";
      constructor(props) {
          super(props);
          this.state = {
              data: [],
              showForm: true,
              showModal: false,
          };
      }
      public handleNetscanSubmit(network: string) {
          const starttime = new Date().getTime();
          const promptmsg = ReactDOM.findDOMNode<HTMLInputElement>(this.refs["prompt"]);
          promptmsg.innerHTML = "Running query...";
          fetch(
              "https://erlvulnscan.lolware.net/netscan/?network=" + network
              ).then((response) => {
                  if(!response.ok) {
                      throw new Error("Network response returned " 
                              + response.status);
                  }
                  return response.json();
              }).then((data) => {
                  this.setState({data: data, showForm: false});
                  const elapsed = new Date().getTime() - starttime;
                  promptmsg.innerHTML = "Scan and render completed in "
                          + elapsed + "ms";
              }).catch((err) => {
                  this.setModal("Unable to connect to backend");
                  console.error(err.message);
              });
    }
    public closeModal() {
        this.setState({showModal: false});
    }
    public setModal(text: string) {
        this.setState({
            showModal: true,
            modalText: text
        });
    }

    public render() {
      const actions = [
        <FlatButton
          label="OK"
          primary={true}
          onTouchTap={this.closeModal.bind(this)}
        />
      ];
      return (
        <div className="jumbotron">
        <div className="panel-heading" ref="prompt">Please enter a /24 network address.</div>
        <NetscanList data={this.state.data} />
        <NetscanForm show={this.state.showForm}
            onNetscanSubmit={this.handleNetscanSubmit.bind(this)}
            setModal={this.setModal.bind(this)}
        />
        <Dialog
          title="Error"
          actions={actions}
          modal={true}
          open={this.state.showModal}
        >
        {this.state.modalText}
        </Dialog>
        </div>
      );
    }
};

export default NetscanBox;

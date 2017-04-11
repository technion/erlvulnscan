import * as React from "react";
import * as ReactDOM from "react-dom";

import {WarningSVG} from "./images.tsx";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "material-ui/Dialog";
import Button from "material-ui/Button";
import {
  List,
  ListItem,
  ListItemText,
} from "material-ui/List";
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';


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

declare const grecaptcha: Recaptcha;


class NetscanList extends React.Component<I_NetScanList, {}> {
   public render() {
   "use strict";
   const commentNodes = this.props.data.map(
           (comment: I_NetScan, index: number) =>
              <IPResult address={comment.address} key={index}>
              {comment.stat}
              </IPResult>
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
        const styleSheet = createStyleSheet('IPResult', () => ({
            red: { backgroundColor: 'red' },
            green: { backgroundColor: 'green' },
            grey: { backgroundColor: 'grey' },
            })
        );
        let ipstate: string;
        const classes = this.context.styleManager.render(styleSheet);
        if (this.props.children === "vulnerable") {
            ipstate = classes.red;
        } else if (this.props.children === "not_vulnerable") {
            ipstate = classes.green;
        } else {
            ipstate = classes.grey // No connect state
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

class NetscanForm extends React.Component<I_NetScanForm, {}> {
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

interface I_NetScanBoxState {
    modalText: string;
    data: Array<I_NetScan>;
    showForm: boolean;
    showModal: boolean;
}

class NetscanBox extends React.Component<{}, I_NetScanBoxState> {
    "use strict";
    constructor(props) {
        super(props);
        this.state = {
            data: [] as Array<I_NetScan>,
            showForm: true,
            showModal: false,
            modalText: "",
        };
    }
    public handleNetscanSubmit(network: string) {
        const starttime = new Date().getTime();
        const promptmsg = ReactDOM.findDOMNode<HTMLInputElement>(this.refs["prompt"]);
        promptmsg.innerHTML = "Running query...";
        fetch(
            "https://erlvulnscan.lolware.net/netscan/?network=" + network
            ).then((response) => {
                if (!response.ok) {
                    throw new Error("Network response returned "
                            + response.status);
                }
                return response.json() as any;
            }).then((data) => {
                this.setState({...this.state, data: data, showForm: false});
                const elapsed = new Date().getTime() - starttime;
                promptmsg.innerHTML = "Scan and render completed in "
                        + elapsed + "ms";
            }).catch((err) => {
                this.setModal("Unable to connect to backend");
                console.error(err.message);
            });
    }
    public closeModal() {
        this.setState({...this.state, showModal: false});
    }
    public setModal(text: string) {
        this.setState({
            ...this.state,
            showModal: true,
            modalText: text
        });
    }

    public render() {
      return (
        <div className="jumbotron">
        <div className="panel-heading" ref="prompt">Please enter a /24 network address.</div>
        <NetscanList data={this.state.data} />
        <NetscanForm show={this.state.showForm}
            onNetscanSubmit={this.handleNetscanSubmit.bind(this)}
            setModal={this.setModal.bind(this)}
        />
        <Dialog open={this.state.showModal}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
                <WarningSVG />
                {this.state.modalText}
          </DialogContent>
          <DialogActions>
              <Button onClick={this.closeModal.bind(this)} primary>
                  OK
              </Button>
          </DialogActions>
          </Dialog>
        </div>
      );
    }
}

export default NetscanBox;

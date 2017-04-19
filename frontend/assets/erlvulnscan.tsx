import * as React from "react";
import * as ReactDOM from "react-dom";

import {I_NetScan} from "./interfaces.d.ts";
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
import { createStyleSheet } from "jss-theme-reactor";
import customPropTypes from "material-ui/utils/customPropTypes";
import { NetscanForm, NetscanList } from "./netscanform.tsx";

interface I_NetScanBoxState {
  modalText: string;
  data: I_NetScan[];
  showForm: boolean;
  showModal: boolean;
}

export class NetscanBox extends React.Component<{}, I_NetScanBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      data: [] as I_NetScan[],
      modalText: "",
      showForm: true,
      showModal: false,
    };
  }
  public handleNetscanSubmit(network: string, recaptcha: string) {
    const starttime = new Date().getTime();
    const promptmsg = document.getElementById("prompt");
    promptmsg.innerHTML = "Running query...";
    // Submission form - POST body in JSON
    const scanform = {
      network: network,
      recaptcha: recaptcha,
    };
    fetch(
      "https://erlvulnscan.lolware.net/netscan/", {
        method: "POST",
        body: JSON.stringify(scanform),
      },
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
        modalText: text,
        showModal: true,
        });
  }

  public render() {
    return (
        <div className="jumbotron">
        <div className="panel-heading" id="prompt" >
          Please enter a /24 network address.
        </div>
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

import * as React from "react";
import * as ReactDOM from "react-dom";
//import { Button, Container, Modal } from "semantic-ui-react";
import Container from "semantic-ui-react/dist/commonjs/elements/Container";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";

import { I_NetScan } from "./interfaces.d.ts";
import { WarningSVG } from "./images.tsx";
import { NetscanForm, NetscanList } from "./netscanform.tsx";

interface I_NetScanBoxState {
  modalText: string;
  data: I_NetScan[];
  showForm: boolean;
  showModal: boolean;
}

interface IErrorModalProp {
  modalText: string;
  showModal: boolean;
  closeModal: () => void;
}

class ErrorModal extends React.Component<IErrorModalProp, {}> {
  public render() {
    return (
      <Modal
        open={this.props.showModal}
        onClose={this.props.closeModal}
        basic>
      <Modal.Header>Error</Modal.Header>
      <Modal.Content>
      <WarningSVG />
        {this.props.modalText}
      </Modal.Content>
      </Modal>
    );
  }
}

export class NetscanBox extends React.Component<{}, I_NetScanBoxState> {
  constructor(props) {
    super(props);
    this.handleNetscanSubmit = this.handleNetscanSubmit.bind(this);
    this.setModal = this.setModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
    if (!promptmsg) {
      throw new Error("Missing prompt element");
    }
    promptmsg.innerHTML = "Running query...";
    // Submission form - POST body in JSON
    const scanform = {
      network,
      recaptcha,
    };
    fetch(
      "https://erlvulnscan.lolware.net/netscan/", {
        body: JSON.stringify(scanform),
        method: "POST",
      },
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Network response returned "
            + response.status);
      }
      return response.json() as any;
    }).then((data) => {
      this.setState({...this.state, data, showForm: false});
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
        <Container text>
        <h2 className="ui header" id="prompt" >
          Please enter a /24 network address.
        </h2>
        <NetscanList data={this.state.data} />
        <NetscanForm show={this.state.showForm}
          onNetscanSubmit={this.handleNetscanSubmit}
          setModal={this.setModal}
        />
        <ErrorModal
          showModal={this.state.showModal}
          modalText={this.state.modalText}
          closeModal={this.closeModal} />
        </Container>
        );
  }
}

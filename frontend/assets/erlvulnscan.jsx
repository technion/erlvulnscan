/* @flow */
require('./phantomjs-shims'); //Compatibility shims from Facbeook
var React = require('react');
var ReactDOM = require('react-dom');
var swal = require('../bower_components/sweetalert/dist/sweetalert.min');

var NetscanList = React.createClass({
   render: function(): ReactElement{
   "use strict";
    var commentNodes = this.props.data.map(function (comment,index) {
      return (
              <IPResult address={comment.address} key={index}>
              {comment.stat} 
              </IPResult>
      );
    });
    return (
      <div >
        {commentNodes}
      </div>
    );
  }
});

var IPResult = React.createClass({
    render: function(): ReactElement {
        "use strict";
        var ipstate;
        if (this.props.children === "vulnerable") {
            ipstate = "alert alert-danger";
        } else if (this.props.children === "not_vulnerable") {
            ipstate = "alert alert-success";
        } else {
            ipstate = "alert alert-info"; //No connect state
        }

        return (
            <div className={ipstate} role="alert">
            {this.props.address} {this.props.children}</div>
        );
    }
});    

var NetscanForm = React.createClass({
  handleSubmit: function(e) {
    "use strict";
    e.preventDefault();
    var network = this.refs.network.value.trim();
    if (!network) {
      return;
    }
    var re = /^\d+\.\d+\.\d+\.0$/; //IP Address match. Not a complete verifier.
    if (!network.match(re)) {
        swal("Invalid input", "Please supply a valid network address in the form x.x.x.0", "error");
        return;
    }
    this.props.onNetscanSubmit(network);
    this.refs.network.value = '';
    return;
  },
  render: function() {
   "use strict";
    if(this.props.show === false) {
        return(null);
    }
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="127.0.0.0" ref="network" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var NetscanBox = React.createClass({
  getInitialState: function() {
    return {data: [], showForm: true};
  },
  handleNetscanSubmit: function(network: string) {
    "use strict";
    var starttime = new Date().getTime();
    this.refs.prompt.innerHTML = "Running query...";
    $.ajax({
      url: "http://erlvulnscan.lolware.net/netscan/?network=" + network,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data, showForm: false});
        var elapsed = new Date().getTime() - starttime;
        this.refs.prompt.innerHTML = "Scan and render completed in " + elapsed + "ms";
      }.bind(this),
      error: function(xhr, status, err) {
        swal("Error", "Unable to connect to backend", "error");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(): ReactElement {
    return (
        <div className="jumbotron">
        <div className="panel-heading" ref="prompt">Please enter a /24 network address.</div>
        <NetscanList data={this.state.data} />
        <NetscanForm show={this.state.showForm} onNetscanSubmit={this.handleNetscanSubmit} />
        </div>
    );
  }
});

ReactDOM.render(
  <NetscanBox />,
  document.getElementById('content')
);

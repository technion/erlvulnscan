
var NetscanList = React.createClass({displayName: "NetscanList",
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
              React.createElement(IPResult, {address: comment.address}, 
              comment.stat
              )
      );
    });
    return (
      React.createElement("div", null, 
        commentNodes
      )
    );
  }
});

var IPResult = React.createClass({displayName: "IPResult",
    render: function() {
        return (
            React.createElement("div", {className: "alert alert-info", role: "alert"}, 
            this.props.address, " ", this.props.children)
        );
    }
});    

var NetscanForm = React.createClass({displayName: "NetscanForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var network = React.findDOMNode(this.refs.network).value.trim();
    if (!network) {
      return;
    }
    this.props.onNetscanSubmit(network);
    React.findDOMNode(this.refs.network).value = '';
    return;
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "127.0.0.0", ref: "network"}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

var NetscanBox = React.createClass({displayName: "NetscanBox",
  getInitialState: function() {
    return {data: []};
  },
  handleNetscanSubmit: function(network) {
    $.ajax({
      url: "http://erlvulnscan.lolware.net/netscan/?network=" + network,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
        React.createElement("div", {className: "jumbotron"}, 
        React.createElement("div", {className: "panel-heading"}, "Please enter a /24 network address."), 
        React.createElement(NetscanList, {data: this.state.data}), 
        React.createElement(NetscanForm, {onNetscanSubmit: this.handleNetscanSubmit})
        )
    );
  }
});

React.render(
  React.createElement(NetscanBox, null),
  document.getElementById('content')
);

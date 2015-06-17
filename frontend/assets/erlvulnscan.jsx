
var NetscanList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
              <IPResult address={comment.address} >
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
    render: function() {
        return (
            <div className="alert alert-info" role="alert">
            {this.props.address} {this.props.children}</div>
        );
    }
});    

var NetscanForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var network = React.findDOMNode(this.refs.network).value.trim();
    if (!network) {
      return;
    }
    var re = /^\d+\.\d+\.\d+\.0$/; //IP Address match. Not a complete verifier.
    if (!network.match(re)) {
        swal("Invalid input", "Please supply a valid network address in the form x.x.x.0", "error");
        return;
    }
    this.props.onNetscanSubmit(network);
    React.findDOMNode(this.refs.network).value = '';
    return;
  },
  render: function() {
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
        <div className="jumbotron">
        <div className="panel-heading">Please enter a /24 network address.</div>
        <NetscanList data={this.state.data} />
        <NetscanForm onNetscanSubmit={this.handleNetscanSubmit} />
        </div>
    );
  }
});

React.render(
  <NetscanBox />,
  document.getElementById('content')
);

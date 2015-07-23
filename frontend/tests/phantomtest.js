var page = require('webpage').create();
page.onConsoleMessage = function(msg) {
      console.log('Console log is: ' + msg);
};
page.open('http://erlvulnscan.lolware.net', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('../logs/view.png');
  }
  phantom.exit();
});

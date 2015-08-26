var page = require('webpage').create();
var fs = require('fs');

page.onConsoleMessage = function(msg) {
      console.log('Console log is: ' + msg);
};
page.open('http://erlvulnscan.lolware.net', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('../logs/view.png');
    var html = page.evaluate(function () {
      return document.getElementsByTagName('html')[0].innerHTML;
    });
    fs.write('../logs/indextestrun.html', "<!doctype html><html>" + html + "</html>", 'w');
  }
  phantom.exit();
});

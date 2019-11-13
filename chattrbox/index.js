var http = require("http");
var fs = require("fs");
// var path = require("path");
var extract = require("./extract");
var wss = require("./websockets-server");
const mime = require("mime");

var handleError = function (err, res) {
  fs.readFile("app/error404.html", function(err, data){
    res.writeHead(404);
    res.end(data);
  })
};

var server = http.createServer(function (req, res){
  console.log("Responding to a request.");
  // var url = req.url;
  // var fileName = "index.html";
  // if (url.length > 1){
  //   fileName = url.substring(1);
  // }
  // console.log(fileName);
  // var filePath = path.resolve(__dirname, "app", fileName);
  // res.end("<h1>Hello, World<\>");
  var filePath = extract(req.url);
  fs.readFile(filePath, function (err,data){
    if (err) {
      handleError(err, res);
      return ;
    } else {
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    }
  });
  var getMime = mime.getType(filePath);
  console.log("MIME type: " + getMime);
});

server.listen(3000);

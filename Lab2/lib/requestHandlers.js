var querystring = require("querystring");
var url = require("url");
var db = require("./db");

var logger = true;

function start(response, postData) {
	if (logger) { console.log("Request handler 'start' was called."); }
	
	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/save" method="get">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function save(response, getData) {
	if (logger) { console.log("Request handler 'save' was called."); }
	
	db.tweets.save({message: "Le message from ze user", timestamp: "Le time"}, function(err, saved) {
		if (err || !saved) {
			console.log("Message not saved");
		}
		else {
			console.log("Message saved");
		}
	});

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Save");
	response.end();
}

function flag(response, getData) {
	if (logger) { console.log("Request handler 'flag' was called."); }
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Flag");
	response.end();
}

function getall(response, getData) {
	if (logger) { console.log("Request handler 'getall' was called."); }
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Getall");
	response.end();
}

function upload(response, postData) {
	if (logger) { console.log("Request handler 'upload' was called."); }

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("You've sent the text: " + querystring.parse(postData).text);
	response.end();
}

exports.start = start;
exports.upload = upload;
exports.save = save;
exports.flag = flag;
exports.getall = getall;
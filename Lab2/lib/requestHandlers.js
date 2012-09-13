var querystring = require("querystring");
var http = require("http");
var url = require("url");
var db = require("./db");

function output_logger(output_text) {
	var logger = true;
	if (logger) {
		console.log(output_text);
	}
}

function start(response, postData) {
	output_logger("Request handler 'start' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Start");
	response.end();
}

function save(response, querys) {
	output_logger("Request handler 'save' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});

	db.insertTweet(querys["text"]);
	response.write("Your text: " + querys["text"] + " was saved to the database. Perhaps anyway, no checks are done. Wopido");

	/*if (message) {
		response.write("Your text: " + querys["text"] + " was saved to the database.");
	}
	else {
		response.write("Your text couldn't be saved to the database. Try again");
	}*/

	response.end();
}

function flag(response, getData) {
	output_logger("Request handler 'flag' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Flag");
	response.end();
}

function getall(response, getData) {
	output_logger("Request handler 'getall' was called.");

	db.getDatabaseCollection("tweet_msg");

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Getall");
	response.end();
}


exports.start = start;
exports.save = save;
exports.flag = flag;
exports.getall = getall;
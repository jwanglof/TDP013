var http = require("http");
var url = require("url");

var db = require("./db");
var ol = require("./output_logger.js");

// Index
function start(response, querys) {
	ol.output_logger("Request handler 'start' was called.", "requestHandlers.js");

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Start");
	response.end();
}

// Save a message
function save(response, querys) {
	ol.output_logger("Request handler 'save' was called.", "requestHandlers.js");

	if (querys["text"])
		var stringLength = Buffer.byteLength(querys["text"]);
	else
		var stringLength = 0;

	// Check to see the string isn't empty and it's less then 140 chars and more than 0
	if (stringLength <= 140 && stringLength > 0) {


		// Inserts the message
		db.insertTweet(querys["text"], function(callbackValue) {
			if (callbackValue) {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write("Your text: " + querys["text"] + " was saved to the database.");
				response.end();
			}
			/* Don't need this since I check this in db.js
			 else {
				response.writeHead(400, {"Content-Type": "text/html"});
				response.write("The text wasn't saved. Try again");
				response.end();
			}*/
		});
	}
	else {
		response.writeHead(400, {"Content-Type": "text/html"});
		response.write("400 Bad Request <br />");

		if (stringLength <= 0)
			response.write("You have to send a text to be inserted into the DB. <br />");
		else if (stringLength > 140)
			response.write("Your text is too large. Please shorten it to 140 characters or less. <br />");

		response.write("I.e. save?text=Someawesometextstring");
		response.end();
	}
}

// Flag a message as read
function flag(response, querys) {
	ol.output_logger("Request handler 'flag' was called.", "requestHandlers.js");

	// Id exist
	if (querys["id"]) {

		// Correct length
		if (Buffer.byteLength(querys["id"]) == 24) {
			db.updateCollection("tweets", querys["id"], {read: 2}, function(callbackValue) {
				response.writeHead(200, {"Content-Type": "text/html"});

				if (callbackValue)
					response.write("The id " + querys["id"] + " is updated.");
				else
					response.write("The id " + querys["id"] + " was NOT updated.");

				response.end();
			});
		}

		// Incorrect length
		else {
			response.writeHead(400, {"Content-Type": "text/html"});
			response.write("400 Bad Request <br />");
			response.write("Invalid ID. It has to be 24 characters");
			response.end();
		}
	}
	else {
		response.writeHead(400, {"Content-Type": "text/html"});
		response.write("400 Bad Request <br />");
		response.write("There is no ID to check for. The URL need to have an id-value. <br />");
		response.write("I.e. flag?id=xxxxxxxxxxxxxxxxxxxxxxxx");
		response.end();
	}
}

// Get all messages
function getall(response, getData) {
	ol.output_logger("Request handler 'getall' was called.", "requestHandlers.js");

	// Get all the data from tweets-collection and show is as JSON
	db.getCollection("tweets", function(docs) {
		if (docs != false) {
			ol.output_logger(JSON.stringify(docs), "requestHandlers.js");

			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("JSON values returned. Check your console.");
			response.end();
		}
	});
}

exports.start = start;
exports.save = save;
exports.flag = flag;
exports.getall = getall;
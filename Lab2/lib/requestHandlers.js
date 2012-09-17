var querystring = require("querystring");
var http = require("http");
var url = require("url");
var db = require("./db");

// Index
function start(response, postData) {
	db.output_logger("Request handler 'start' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Start");
	response.end();
}

// Save a message
function save(response, querys) {
	db.output_logger("Request handler 'save' was called.");

	// Check to see the string isn't empty and it's less then 140 chars and more than 0
	if (querys["text"] && querys["text"].length <= 140 && querys["text"].length > 0) {
		response.writeHead(200, {"Content-Type": "text/html"});

		// Inserts the message
		db.insertTweet(querys["text"], function(callbackValue) {
			if (callbackValue)
				response.write("Your text: " + querys["text"] + " was saved to the database.");
			else
				response.write("The text wasn't saved. Try again");
		});

		response.end();
	}
	else {
		response.writeHead(400, {"Content-Type": "text/html"});
		response.write("400 Bad Request <br />");
		response.write("You have to send a text to be inserted into the DB. <br />");
		response.write("I.e. save?text=Someawesometextstring");
		response.end();
	}
}

// Flag a message as read
function flag(response, querys) {
	db.output_logger("Request handler 'flag' was called.");

	// Id exist
	if (querys["id"]) {
		response.writeHead(200, {"Content-Type": "text/html"});

		// Correct length
		if (Buffer.byteLength(querys["id"]) == 24) {
			db.updateCollection("tweets", querys["id"], {read: 2}, function(callbackValue) {
				if (callbackValue)
					response.write("The id " + querys["id"] + " is updated.");
				else
					response.write("The id " + querys["id"] + " was NOT updated.");

				response.end();
			});
		}
		// Incorrect length
		else if (Buffer.byteLength(querys["id"]) < 24 || Buffer.byteLength(querys["id"]) > 24) {
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
	db.output_logger("Request handler 'getall' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});

	// Get all the data from tweets-collection and show is as JSON
	db.getCollection("tweets", function(docs) {
		if (docs != false) {
			response.write("JSON values returned. Check your console.");
			db.output_logger(JSON.stringify(docs));
			response.end();
		}
	});
}


exports.start = start;
exports.save = save;
exports.flag = flag;
exports.getall = getall;
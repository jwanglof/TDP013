var querystring = require("querystring");
var http = require("http");
var url = require("url");
var db = require("./db");

function start(response, postData) {
	db.output_logger("Request handler 'start' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Hello Start");
	response.end();
}

function save(response, querys) {
	db.output_logger("Request handler 'save' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});
	
	// Check to see the string isn't empty
	if (querys["text"]) {
		db.insertTweet(querys["text"], function(callbackValue) {
			console.log(callbackValue);
			if (callbackValue)
				response.write("Your text: " + querys["text"] + " was saved to the database.");
			else
				response.write("The text wasn't saved. Try again");
		});
	}
	else {
		response.write("You have to send a text to be inserted into the DB.");
	}

	response.end();
}

function flag(response, querys) {
	db.output_logger("Request handler 'flag' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});
	
	// Check the string so it is the correct length
	if (querys["id"]) {
		if (Buffer.byteLength(querys["id"]) == 24) {
			db.updateCollection("tweets", querys["id"], {read: 2}, function(callbackValue) {
				// Doesn't work by some unreasonable reason. callbackValue is set to true or false but response won't write anything on the site...
				console.log(callbackValue);

				if (callbackValue)
					response.write("The id " + querys["id"] + " is updated.");
				else
					response.write("The id " + querys["id"] + " was NOT updated.");
			});
		}
		else if (Buffer.byteLength(querys["id"]) < 24 || Buffer.byteLength(querys["id"]) > 24)
			response.write("Invalid ID. It has to be 24 characters");
	}
	else {
		response.write("There is no ID to check for. The URL need to have an id-value. <br />");
		response.write("I.e. flag?id=xxxxxxxxxxxxxxxxxxxxxxxx");
	}
	
	response.end();
}

function getall(response, getData) {
	db.output_logger("Request handler 'getall' was called.");

	response.writeHead(200, {"Content-Type": "text/html"});

	// Get all the data from tweets-collection
	db.getCollection("tweets", function(docs) {
		response.write(JSON.stringify(docs));
		db.output_logger(JSON.stringify(docs));
	});

	response.write("Hello Getall");
	response.end();
}


exports.start = start;
exports.save = save;
exports.flag = flag;
exports.getall = getall;
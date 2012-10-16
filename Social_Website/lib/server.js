var http = require("http");
var url = require("url");
var querystring = require("querystring");

/*
 * Output logger is a help tool that makes the outputs in the console better, and makes it easier to shut off the logging
 * Takes 2 arguments: What text to be shown, and which file the text originates from
 */
var ol = require("./helpers/output_logger");
var filename = "server.js";

var serverPort = 8888;

/*
 * Handle when there is POST-data available
 * Add the chunks to postData so it will come as one piece
 */
function getPost(req, callback) {
	var postData = "";

	req.on("data", function(postDataChunk) {
		postData += postDataChunk;
	});

	req.on("end", function() {
		postData = querystring.parse(postData);
		callback(postData);
	});
}

/*
 * Create the request server
 */
function startServer(route, handle) {
	function onRequest(request, response) {
		ol.logger("Request for " + pathname + " received.", filename);

		var pathname = url.parse(request.url).pathname;
		var querys = url.parse(request.url, true).query;

		request.setEncoding("utf-8");

		// handle contains the handles from index.js
		// pathname contains ONLY the pathname! E.g. /save
		// response is the entire output from the server with headers, configuration etc etc
		// querys contains ONLY the querys! E.g. ?text=someniceandawesometext (in a map)
		getPost(request, function(result) {
			route(handle, response, request, pathname, querys, result);
		});
	}

	http.createServer(onRequest).listen(serverPort);

	ol.logger("Server has started on port: " + serverPort, filename);
}

exports.startServer = startServer;
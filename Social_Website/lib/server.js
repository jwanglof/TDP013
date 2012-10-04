var http = require("http");
var url = require("url");
var querystring = require("querystring");

var ol = require("./helpers/output_logger");

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

function startServer(route, handle) {
	function onRequest(request, response) {
			var pathname = url.parse(request.url).pathname;

			// The favicon request output isn't shown in the console
			if (pathname != "/favicon.ico") {
				ol.logger("Request for " + pathname + " received.", "server.js");

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
	}

	http.createServer(onRequest).listen(8888);

	ol.logger("Server has started.", "server.js");
}

exports.startServer = startServer;
var http = require("http");
var url = require("url");

var ol = require("./output_logger.js");

function startServer(route, handle) {
	function onRequest(request, response) {
		if (request.method == "GET") {
			var pathname = url.parse(request.url).pathname;

			// The favicon request output isn't shown in the console
			if (pathname != "/favicon.ico") {
				ol.output_logger("Request for " + pathname + " received.", "server.js");

				var querys = url.parse(request.url, true).query;

				request.setEncoding("utf-8");

				// handle contains the handles from index.js
				// pathname contains ONLY the pathname! E.g. /save
				// response is the entire output from the server with headers, configuration etc etc
				// querys contains ONLY the querys! E.g. ?text=someniceandawesometext (will deliver in a map)

				route(handle, response, request, pathname, querys);				
			}
		}
		else {
			response.writeHead(405, {"Content-Type": "text/html"});
			response.write("405 Method Not Allowed <br />");
			response.end();
		}
	}

	http.createServer(onRequest).listen(8888);

	ol.output_logger("Server has started.", "server.js");
}

exports.startServer = startServer;
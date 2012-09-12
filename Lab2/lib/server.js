var http = require("http");
var url = require("url");

function startServer(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;

		// The favicon request output isn't shown in the console
		if (pathname != "/favicon.ico") {
			console.log("Request for " + pathname + " received.");

			var querys = url.parse(request.url, true).query;

			request.setEncoding("utf-8");

			// handle contains the handles from index.js
			// pathname contains ONLY the pathname! E.g. /save
			// response is the entire output from the server with headers, configuration etc etc
			// querys contains ONLY the querys! E.g. ?text=someniceandawesometext (will deliver in a map)

			route(handle, response, pathname, querys);
		}
	}

	http.createServer(onRequest).listen(8888);

	console.log("Server has started.");
}

exports.startServer = startServer;
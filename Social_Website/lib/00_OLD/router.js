var ol = require("./output_logger.js");

function route(handle, response, request, pathname, querys) {
	if (typeof handle[pathname] === "function") {
		ol.output_logger("About to route a request for " + pathname, "router.js");

		handle[pathname](response, request, querys);
	}
	else {
		ol.output_logger("No request handler found for " + pathname, "router.js");

		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found");
		response.end();
	}
}

exports.route = route;
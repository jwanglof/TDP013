var ol = require("./helpers/output_logger");

function route(handle, response, request, pathname, querys, postData) {
	if (typeof handle[pathname] === "function") {
		ol.logger("About to route a request for " + pathname, "router.js");

		handle[pathname](response, request, postData);
	}
	else {
		ol.logger("No request handler found for " + pathname, "router.js");

		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found");
		response.end();
	}
}

exports.route = route;
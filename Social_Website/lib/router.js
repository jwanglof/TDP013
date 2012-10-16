/*
 * Output logger is a help tool that makes the outputs in the console better, and makes it easier to shut off the logging
 * Takes 2 arguments: What text to be shown, and which file the text originates from
 */
var ol = require("./helpers/output_logger");
var filename = "router.js";

/*
 * Handle all routes
 * If a route isn't specificed in index.js it will return a 404 error
 */
function route(handle, response, request, pathname, querys, postData) {
	if (typeof handle[pathname] === "function") {
		ol.logger("About to route a request for " + pathname, filename);

		handle[pathname](response, request, postData);
	}
	else {
		ol.logger("No request handler found for " + pathname, filename);

		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found");
		response.end();
	}
}

exports.route = route;
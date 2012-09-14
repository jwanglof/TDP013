function output_logger(output_text) {
	var logger = true;
	if (logger) {
		console.log(output_text);
	}
}

function route(handle, response, pathname, querys) {
	output_logger("About to route a request for " + pathname);
	
	if (typeof handle[pathname] === "function") {
		handle[pathname](response, querys);
	}
	else {
		output_logger("No request handler found for " + pathname);

		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found");
		response.end();
	}
}

exports.route = route;
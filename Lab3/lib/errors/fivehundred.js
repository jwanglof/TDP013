function error500(response) {
	response.writeHead(500, {"Content-Type": "text/html"});
	response.write("500 Internal Server Error <br />");
	response.end();
}

exports.error500 = error500;
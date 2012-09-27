// Exists so it's easy to turn on or off all the console logging
function output_logger(output_text, from_handler) {
	var logger = true;
	if (logger) {
		console.log("(" + from_handler + ") -- " + output_text);
	}
}

exports.logger = output_logger;
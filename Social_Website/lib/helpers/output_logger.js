/*
 * Easy to turn on or off the logging
 * Get a pretty output to the console
 * The for-loop makes sure that the output_text is in line
 */
function output_logger(output_text, from_handler) {
	var logger = true;
	if (logger) {
		var spaces = "";
		for (var i = from_handler.length; i < 40; i++)
			spaces += " ";

		console.log("[" + from_handler + "] " + spaces + " " + output_text);
	}
}

exports.logger = output_logger;
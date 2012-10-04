var http = require("http");
var url = require("url");

var db = require("./db");
var ol = require("./helpers/output_logger");

function get_headers(request) {
	var callbackHeaders = {};
	callbackHeaders["Access-Control-Allow-Origin"] = "*";
	callbackHeaders["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
	callbackHeaders["Content-Type"] = "application/json";
	return callbackHeaders;
}

// Index
function start(response, request, querys) {
	ol.logger("Request handler START was called.", "requestHandlers.js");

	var headers = get_headers(request);
	response.writeHead(200, headers);
	response.write("Hello Start");
	response.end();
}

function login(res, req, postData) {
	db.getUser(postData, function(callback, result) {
		if (callback) {
			//Add to session
			ol.logger("A user logged in", "requestHandlers.js");
		}
		else
			ol.logger("ERROR: A user failed to logged in", "requestHandlers.js");
	});
}

function register(res, req, postData) {
	db.registerUser(postData, function(callback) {
		if (callback) {
			res.writeHead(200, get_headers(req));
			res.write("0");
			res.end();
			return;
		}
		else
			console.log("NOOOOPE");
	});
}

exports.start = start;
exports.login = login;
exports.register = register;
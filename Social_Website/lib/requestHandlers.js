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
			res.writeHead(200, get_headers(req));
			res.write(JSON.stringify(result));
			res.end();
		}
		else {
			ol.logger("ERROR: A user failed to logged in", "requestHandlers.js");
			res.writeHead(500, get_headers(req));
			res.write(JSON.stringify("0"));
			res.end();			
		}
	});
}

function register(res, req, postData) {
	db.registerUser(postData, function(callback) {
		if (callback) {
			res.writeHead(200, get_headers(req));
			res.write("1");
			res.end();
		}
		else
			console.log("NOOOOPE");
	});
}

function profile(res, req, postData) {
	db.getUser(postData, function(callback, result) {
		if (callback) {
			// getWallText doesn't work. result._id is not a string. Works when it is a string!
			db.getWallText({to_id: result._id}, function(callback, wallResult) {
				//console.log(wallResult);
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			});
		}
		else {
			res.writeHead(500, get_headers(req));
			res.end();
		}
	});
}

function friends(res, req, postData) {
	db.getUserFriends(postData, function(callback, result) {
		if (callback) {
			//console.log("ASDASD" + result);
			//getFriends(result, function(friends) {
				//console.log("DSADSA" + friends);
/*				console.log(JSON.stringify(friends));
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(friends));
				res.end();*/

			//});
			var friendsArray = new Array();

			for (var i = 0; i < result.length; i++) {
				db.getUser({_id: result[i]}, function(callb, result) {
					console.log(result);
					friendsArray.push(result);
					//friendsArray[i] = result;
					
					if (i == friends.length-1) {
						console.log("UUUU");
						callback(friendsArray);
					}
				});
				console.log(result.length + " {{{{{{{{ " + i);
			}


		}
		else {
			res.writeHead(500, get_headers(req));
			res.end();
		}
	});
}

function search(res, req, postData) {
	db.search(postData, function(callback, result) {
		if (callback) {
			res.writeHead(200, get_headers(req));
			res.write(JSON.stringify(result));
			res.end();
		}
		else {
			res.writeHead(500, get_headers(req));
			res.end();
		}
	});
}

function addFriend(res, req, postData) {
	db.addUserFriend(postData, function(callback) {
		if (callback) {
			res.writeHead(200, get_headers(req));
			res.end();
		}
		else {
			res.writeHead(500, get_headers(req));
			res.end();
		}
	});
}

var getFriends = function(friends, callback) {
	var friendsArray = new Array();
	console.log(friends);
	if (friends != undefined) {

		for (var i = 0; i < friends.length; i++) {
			db.getUser({_id: friends[i]}, function(callb, result) {
				console.log(result);
				friendsArray.push(result);
				//friendsArray[i] = result;

				if (i == friends.length-1) {
					console.log("UUUU");
					callback(JSON.stringify(friendsArray));
				}
			});
			console.log(friends.length-1 + " {{{{{{{{ " + i);


		}
	}
	else
		callback();
}



exports.start = start;
exports.login = login;
exports.register = register;
exports.profile = profile;
exports.friends = friends;
exports.search = search;
exports.addFriend = addFriend;
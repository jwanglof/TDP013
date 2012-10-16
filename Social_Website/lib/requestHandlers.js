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
/*function start(response, request, querys) {
	ol.logger("Request handler START was called.", "requestHandlers.js");

	var headers = get_headers(request);
	response.writeHead(200, headers);
	response.write("Hello Start");
	response.end();
}*/

function login(res, req, json_data) {
	ol.logger("Request handler LOGIN was called.", "requestHandlers.js");

	if (json_data.email) {
		db.getUser(json_data, function(callback, result) {
			if (callback) {
				ol.logger("A user logged in", "requestHandlers.js");
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			}
			else {
				ol.logger("ERROR: A user failed to logged in", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();			
			}
		});
	}
	else {
		ol.logger("ERROR: Could not sign in a user. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function register(res, req, json_data) {
	ol.logger("Request handler REGISTER was called.", "requestHandlers.js");

	if (json_data.email) {
		db.registerUser(json_data, function(callback) {
			if (callback) {
				ol.logger("A user registered", "requestHandlers.js");
				res.writeHead(200, get_headers(req));
				res.end();
			}
			else {
				ol.logger("ERROR: A user failed to register", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not register. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function profile(res, req, json_data) {
	ol.logger("Request handler PROFILE was called.", "requestHandlers.js");

	if (json_data._id) {
		db.getUser(json_data, function(callback, result) {
			if (callback) {
				ol.logger("Retrieved a profile", "requestHandlers.js");
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			}
			else {
				ol.logger("ERROR: Failed to retrieve a profile", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not retrieve a profile. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function search(res, req, json_data) {
	ol.logger("Request handler SEARCH was called.", "requestHandlers.js");

	if (json_data.email) {
		db.search(json_data, function(callback, result) {
			if (callback) {
				ol.logger("Retrieved users from a search", "requestHandlers.js");
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			}
			else {
				ol.logger("ERROR: Failed to retrieve users from a search", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not retrieve a search result. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function addFriend(res, req, json_data) {
	ol.logger("Request handler ADDFRIEND was called.", "requestHandlers.js");

	if (json_data._id) {
		db.addUserFriend(json_data, function(callback) {
			if (callback) {
				ol.logger("A new beautiful friendship has been made. B-e-a-utiful!", "requestHandlers.js");
				res.writeHead(200, get_headers(req));
				res.end();
			}
			else {
				ol.logger("ERROR: Could not make a new friendship", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not create a beautiful new friendship. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function checkFriendship(res, req, json_data) {
	ol.logger("Request handler CHECKFRIENDSHIP was called.", "requestHandlers.js");

	if (json_data.userId) {
		db.checkFriendship(json_data, function(callback) {
			if (callback) {
				ol.logger("Retrieved a friendship", "requestHandlers.js");
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(callback));
				res.end();
			}
			else {
				ol.logger("ERROR: Could not retrieve a friendship", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not check a friendship. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function friends(res, req, json_data) {
	ol.logger("Request handler FRIENDS was called.", "requestHandlers.js");

	if (json_data._id) {
		db.getUserFriends(json_data, function(callback, result) {
			if (callback) {
				getFriends(result, function(friendsArray) {
					ol.logger("Returned a friend-array", "requestHandlers.js");
					res.writeHead(200, get_headers(req));
					res.write(JSON.stringify(friendsArray));
					res.end();
				});
			}
			else {
				ol.logger("ERROR: Could not return a friend-array", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not get a user's friends. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function getWall(res, req, json_data) {
	ol.logger("Request handler GETWALL was called.", "requestHandlers.js");

	if (json_data.to_id) {
		db.getWallText(json_data, function(callback, result) {
			if (callback) {		
				getWallposts(result, function(docs) {
					ol.logger("Returned a wall-array", "requestHandlers.js");
					res.writeHead(200, get_headers(req));
					res.write(JSON.stringify(docs));
					res.end();
				});
			}
			else {
				ol.logger("ERROR: Could not return a wall-array", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not get a user's wallposts. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

function writeWall(res, req, json_data) {
	ol.logger("Request handler WRITEWALL was called.", "requestHandlers.js");

	if (json_data.wallpost) {
		db.addWallText(json_data, function(callback) {
			if (callback) {
				ol.logger("Wrote on a wall", "requestHandlers.js");
				res.writeHead(200, get_headers(req));
				res.end();
			}
			else {
				ol.logger("ERROR: Could not write on a wall", "requestHandlers.js");
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not write on a user's wall. No data available.", "requestHandlers.js");
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

var getFriends = function(friendIds, callback) {
	ol.logger("Function GETFRIENDS was called.", "requestHandlers.js");

	var friendsArray = new Array();

	friendIds.forEach(function(value, i, ar) {
		db.getUser({_id: value}, function(callb, result) {
			friendsArray.push(result);

			if (friendsArray.length == friendIds.length)
				callback(friendsArray);
		});
	});
}

var getWallposts = function(wallPosts, callback) {
	ol.logger("Function GETWALLPOSTS was called.", "requestHandlers.js");

	var wallArray = new Array();
	
	wallPosts.forEach(function(value, i, ar) {
		db.getUser({_id: value.from_id}, function(callb, res) {
			wallArray.push({_id: value.from_id, from: res.firstname, wallpost: value.wallpost});

			if (wallArray.length == wallPosts.length)
				callback(wallArray);
		});
	});
}

//exports.start = start;
exports.login = login;
exports.register = register;
exports.profile = profile;
exports.friends = friends;
exports.search = search;
exports.addFriend = addFriend;
exports.checkFriendship = checkFriendship;
exports.getWall = getWall;
exports.writeWall = writeWall;
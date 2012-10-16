var http = require("http");
var url = require("url");

var db = require("./db");

/*
 * Output logger is a help tool that makes the outputs in the console better, and makes it easier to shut off the logging
 * Takes 2 arguments: What text to be shown, and which file the text originates from
 */
var ol = require("./helpers/output_logger");
var filename = "requestHandlers.js";

/*
 * Handle registrations
 * Writes only a 200 OK to the client side
 * If the registration fails it will write a 500 error to the client side which will display an error
 * If no data is available it will return a 400 error
 */
function register(res, req, json_data) {
	ol.logger("Request handler REGISTER was called.", filename);

	if (json_data.email) {
		db.registerUser(json_data, function(callback) {
			if (callback) {
				ol.logger("A user registered", filename);
				res.writeHead(200, get_headers(req));
				res.end();
			}
			else {
				ol.logger("ERROR: A user failed to register", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not register. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle log ins
 * Writes a JSON-object to the client side
 * If log in fails it will write a 500 error to the client side which will display an error
 * If no data is available it will return a 400 error
 */
function login(res, req, json_data) {
	ol.logger("Request handler LOGIN was called.", filename);

	if (json_data.email) {
		db.getUser(json_data, function(callback, result) {
			if (callback) {
				ol.logger("A user logged in", filename);
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			}
			else {
				ol.logger("ERROR: A user failed to logged in", filename);
				res.writeHead(500, get_headers(req));
				res.end();			
			}
		});
	}
	else {
		ol.logger("ERROR: Could not sign in a user. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle profiles
 * Writes a JSON-object to the client side
 * If it fails to retrieve a profile it will write a 500 error to the client side which will display an error
 * If no data is available it will return a 400 error
 */
function profile(res, req, json_data) {
	ol.logger("Request handler PROFILE was called.", filename);

	if (json_data._id) {
		db.getUser(json_data, function(callback, result) {
			if (callback) {
				ol.logger("Retrieved a profile", filename);
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			}
			else {
				ol.logger("ERROR: Failed to retrieve a profile", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not retrieve a profile. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle searches
 * Writes an array with JSON-objects in it
 * If the search fails it will write a 500 error to the client side which will display an error
 * If no data is available it will return a 400 error
 */
function search(res, req, json_data) {
	ol.logger("Request handler SEARCH was called.", filename);

	if (json_data.email) {
		db.search(json_data, function(callback, result) {
			if (callback) {
				ol.logger("Retrieved users from a search", filename);
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			}
			else {
				ol.logger("ERROR: Failed to retrieve users from a search", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not retrieve a search result. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle new friendships
 * Writes only a 200 OK to the client side
 * If it can't create the new friendship it will write a 500 error to the client side
 * If no data is available it will return a 400 error
 */
function addFriend(res, req, json_data) {
	ol.logger("Request handler ADDFRIEND was called.", filename);

	if (json_data._id) {
		db.addUserFriend(json_data, function(callback) {
			if (callback) {
				ol.logger("A new beautiful friendship has been made. B-e-a-utiful!", filename);
				res.writeHead(200, get_headers(req));
				res.end();
			}
			else {
				ol.logger("ERROR: Could not make a new friendship", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not create a beautiful new friendship. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle new friendships
 * Writes a JSON-object to the client side
 * If it fails to look up the users' friendship it will write a 500 error to the client side
 * If no data is available it will return a 400 error
 */
function checkFriendship(res, req, json_data) {
	ol.logger("Request handler CHECKFRIENDSHIP was called.", filename);

	if (json_data.userId) {
		db.checkFriendship(json_data, function(callback) {
			if (callback) {
				ol.logger("Retrieved a friendship", filename);
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(callback));
				res.end();
			}
			else {
				ol.logger("ERROR: Could not retrieve a friendship", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not check a friendship. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle a user's friends
 * Writes an array with JSON-objects in it
 * If the user doesn't have any friends it will return a 500 error. Perhaps not the best error to write.
 * If no data is available it will return a 400 error
 */
function friends(res, req, json_data) {
	ol.logger("Request handler FRIENDS was called.", filename);

	if (json_data._id) {
		db.getUserFriends(json_data, function(callback, result) {
			if (callback) {
				getFriends(result, function(friendsArray) {
					ol.logger("Returned a friend-array", filename);
					res.writeHead(200, get_headers(req));
					res.write(JSON.stringify(friendsArray));
					res.end();
				});
			}
			else {
				ol.logger("ERROR: Could not return a friend-array", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not get a user's friends. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle when a user writes to another user
 * Writes only a 200 OK to the client side
 * If it fails to write to a user it will write a 500 error to the client side which will display an error
 * If no data is available it will return a 400 error
 */
function writeWall(res, req, json_data) {
	ol.logger("Request handler WRITEWALL was called.", filename);

	if (json_data.wallpost) {
		db.addWallText(json_data, function(callback) {
			if (callback) {
				ol.logger("Wrote on a wall", filename);
				res.writeHead(200, get_headers(req));
				res.end();
			}
			else {
				ol.logger("ERROR: Could not write on a wall", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not write on a user's wall. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * Handle a user's wallposts
 * Writes an array with JSON-objects in it
 * If the user doesn't have any wallposts it will return a 500 error. Perhaps not the best error to write.
 * If no data is available it will return a 400 error
 */
function getWall(res, req, json_data) {
	ol.logger("Request handler GETWALL was called.", filename);

	if (json_data.to_id) {
		db.getWallText(json_data, function(callback, result) {
			if (callback) {		
				getWallposts(result, function(docs) {
					ol.logger("Returned a wall-array", filename);
					res.writeHead(200, get_headers(req));
					res.write(JSON.stringify(docs));
					res.end();
				});
			}
			else {
				ol.logger("ERROR: Could not return a wall-array", filename);
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});
	}
	else {
		ol.logger("ERROR: Could not get a user's wallposts. No data available.", filename);
		res.writeHead(400, get_headers(req));
		res.end();
	}
}

/*
 * A help function that helps the read-ability of the code
 * Is called whenever HTTP headers are needed
 */
function get_headers(request) {
	var callbackHeaders = {};
	callbackHeaders["Access-Control-Allow-Origin"] = "*";
	callbackHeaders["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
	callbackHeaders["Content-Type"] = "application/json";
	return callbackHeaders;
}

/*
 * Loops through the friend IDs to get the specific user's information and add it to an array
 * When this array is the same size as the givven array it will return it
 * Is called from friends
 */
var getFriends = function(friendIds, callback) {
	ol.logger("Function GETFRIENDS was called.", filename);

	var friendsArray = new Array();

	friendIds.forEach(function(value, i, ar) {
		db.getUser({_id: value}, function(callb, result) {
			friendsArray.push(result);

			if (friendsArray.length == friendIds.length)
				callback(friendsArray);
		});
	});
}

/*
 * Loops through the wallposts to get the name of the user who wrote it and add it to an array
 * When this array is the same as the givven array it will return it
 * Is called from getWall
 */
var getWallposts = function(wallPosts, callback) {
	ol.logger("Function GETWALLPOSTS was called.", filename);

	var wallArray = new Array();
	
	wallPosts.forEach(function(value, i, ar) {
		db.getUser({_id: value.from_id}, function(callb, res) {
			wallArray.push({_id: value.from_id, from: res.firstname, wallpost: value.wallpost});

			if (wallArray.length == wallPosts.length)
				callback(wallArray);
		});
	});
}

exports.login = login;
exports.register = register;
exports.profile = profile;
exports.friends = friends;
exports.search = search;
exports.addFriend = addFriend;
exports.checkFriendship = checkFriendship;
exports.getWall = getWall;
exports.writeWall = writeWall;
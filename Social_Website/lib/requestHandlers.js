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
		//console.log(result);
		if (callback) {
			//console.log(typeof(result._id)); // Output: object
			// getWallText doesn't work. result._id is not a string. Works when it is a string!
			//var bla = JSON.stringify(result._id);
			//db.getWallText({to_id: result._id}, function(callback, wallResult) {
				//console.log(wallResult);
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(result));
				res.end();
			//});
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

function checkFriendship(res, req, json_data) {
	db.checkFriendship(json_data, function(callback) {
		if (callback) {
			res.writeHead(200, get_headers(req));
			res.write(JSON.stringify(callback));
			res.end();
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
			getFriends(result, function(friendsArray) {
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(friendsArray));
				res.end();
			});
		}
		else {
			res.writeHead(500, get_headers(req));
			res.end();
		}
	});
}

function getWall(res, req, json_data) {
	db.getWallText(json_data, function(callback, result) {
		getWallposts(result, function(docs) {
			if (callback) {
				res.writeHead(200, get_headers(req));
				res.write(JSON.stringify(docs));
				res.end();
			}
			else {
				res.writeHead(500, get_headers(req));
				res.end();
			}
		});

	});
}

var getFriends = function(friendIds, callback) {
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
	var wallArray = new Array();
	
	wallPosts.forEach(function(value, i, ar) {
		//db.getUser({_id: value.to_id}, function(callb, res1) {
			db.getUser({_id: value.from_id}, function(callb, res2) {
				wallArray.push({_id: value.from_id, from: res2.firstname, wallpost: value.wallpost});
				if (wallArray.length == wallPosts.length)
					callback(wallArray);
			});
		//});
	});
}

exports.start = start;
exports.login = login;
exports.register = register;
exports.profile = profile;
exports.friends = friends;
exports.search = search;
exports.addFriend = addFriend;
exports.checkFriendship = checkFriendship;
exports.getWall = getWall;
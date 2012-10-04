var db = require("../db");

var getFriends = function(friends, callback) {
	var friendsArray = new Array();

	if (friends != undefined) {
		for (var i = 0; i < friends.length; i++) {
			db.getUser({"_id": friends[i]}, function(callb, result) {
				friendsArray.push(result);

				if (i == friends.length)
					callback(friendsArray);
			});
		}
	}
	else
		callback();
}

var checkFriendship = function(user, friend, callback) {
	db.checkFriendship({userId: user, friendId: friend}, function(good) {
		callback(good);
	});
}

exports.getFriends = getFriends;
exports.checkFriendship = checkFriendship;
var db = require("../db");

var getWallPosts = function(userId, callback) {
	var wallpostArray = new Array();
	var wallpsot;

	db.getWallText({to_id: userId}, function(good, result) {
		console.log(good + " ))))))_____***** " + result);
		if (good) {
			for (var i = 0; i < result.length; i++) {
				wallpsot = result[i]["wallpost"];

				db.getUser({_id: result[i]["from_id"]}, function(err, user_result) {

					wallpostArray.push({wallpost: wallpsot, from_user: user_result.firstname, from_id: user_result._id});

					if (i == result.length)
						callback(true, wallpostArray);
					else
						callback(false);
				});
			}
		}
		else {
			console.log("ERROR: Could not get the user's wallposts");
			callback();
		}
	});
}

exports.getWallPosts = getWallPosts;
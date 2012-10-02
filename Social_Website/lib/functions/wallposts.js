var db = require("../db");

var getWallPosts = function(userId, callback) {
	var wallpostArray = new Array();

	db.getWallText({to_id: userId}, function(good, result) {
		console.log(good + " ))))))_____***** " + result);
		if (good) {
			for (var i = 0; i < result.length; i++) {
				var res_wallpost = result[i]["wallpost"];

				db.getUser({_id: result[i]["from_id"]}, function(err, user_result) {
					wallpostArray.push({wallpost: res_wallpost, from_user: user_result.firstname, from_id: user_result._id});
				});
			}
			callback(wallpostArray);
		}
		else
			callback();
	});
}

exports.getWallPosts = getWallPosts;
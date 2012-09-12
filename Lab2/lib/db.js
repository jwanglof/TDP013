var databaseUrl = "localhost:27017/tdp013laboration2";
var collection = ["tweets"];
var db = require("mongojs").connect(databaseUrl, collection);

exports.db = db;

/* When the DB is needed:
 * var db = require("./db");
 */

/*db.tweets.save({message: "Le message from ze user", timestamp: "Le time"}, function(err, saved) {
	if (err || !saved) {
		console.log("Message not saved");
	}
	else {
		console.log("Message saved");
	}
});*/
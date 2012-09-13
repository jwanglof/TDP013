var mongo = require("mongodb");

var server = new mongo.Server("localhost", 27017);
var db = new mongo.Db("tdp013lab2", server);

var insertTweet = function(input_message, callback) {
	db.open(function(err, db) {
		if (!err) {
			console.log("DB connected");
			db.collection("tweets", function(err, collection) {
				var tweet_msg = {message: input_message, read: 0};

				collection.insert(tweet_msg, function(err, result) {
					if (!err) {
						console.log("Inserted: " + input_message + " to the DB");
					}
					else {
						console.log("Couldn't insert: " + input_message + " to the DB");
					}
				});
			});
		}
	});
}

var getDatabaseCollection = function(dbCollection, callback) {
	db.open(function(err, db) {
		if (!err) {
			console.log("DB connected");

			db.collection("tweets", function(err, collection) {
				if (!err) {
					console.log(collection.find({}));
				}
			});
		}
	});
}

exports.insertTweet = insertTweet;
exports.getDatabaseCollection = getDatabaseCollection;



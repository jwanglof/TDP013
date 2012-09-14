var mongo = require("mongodb");

var server = new mongo.Server("localhost", 27017);
var db = new mongo.Db("tdp013lab2", server);

function output_logger(output_text) {
	var logger = true;
	if (logger) {
		console.log(output_text);
	}
}

db.open(function(err, db) {
	if (!err) {
		output_logger("DB connected");

		var insertTweet = function(input_message, callback) {
			db.collection("tweets", function(err, collection) {
				collection.insert(
					{
						message: input_message,
						read: 0
					},
					function(err, result) {
						if (!err) {
							output_logger("Inserted: " + input_message + " to the DB");
							callback(true);
						}
						else {
							output_logger("Couldn't insert: " + input_message + " to the DB");
							callback(false);
						}
					});
			});
		}

		var getCollection = function(dbCollection, callback) {
			db.collection(dbCollection, function(err, collection) {
				if (!err) {
					collection.find(
						{
						}
					).toArray(
						function(err, docs) {
							callback(docs);
						});
				}
				else {
					output_logger("Couldn't get the collection.");
				}
			});
		}

		var updateCollection = function(dbCollection, id, JSONvalue, callback) {
			output_logger("Called updateCollection");

			db.collection(dbCollection, function(err, collection) {
				if (!err) {
					var dbId = new mongo.BSONPure.ObjectID.createFromHexString(id);

					collection.update(
						{
							_id: dbId
						},
						{
							$set: JSONvalue
						},
						{
							safe: true, //Run callback only when an update is done, false as default
							upsert: false, //Inserts a new record if not found
							multi: false //Update all records found, false as default
						},
						function(err, count) {
							if (!err)
								callback(true);
							else
								callback(false);
						});
				}
			});
		}

		exports.insertTweet = insertTweet;
		exports.getCollection = getCollection;
		exports.updateCollection = updateCollection;
	}
	else {
		output_logger("An error occured when connecting to the DB");
	}
});

exports.output_logger = output_logger;

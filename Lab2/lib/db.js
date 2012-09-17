var mongo = require("mongodb");
var http = require("http");
var url = require("url");

var ol = require("./output_logger.js");

var server = new mongo.Server("localhost", 27017);
var db = new mongo.Db("tdp013lab2", server);

function fivehundred_error(response) {
	response.writeHead(500, {"Content-Type": "text/html"});
	response.write("500 Internal Server Error <br />");
	response.end();
}

// The db connection will be always be open
db.open(function(err, db) {
	if (!err) {
		ol.output_logger("DB connected", "db.js");

		var insertTweet = function(input_message, callback) {
			db.collection("tweets", function(err, collection) {
				collection.insert(
					{
						message: input_message,
						flag: false
					},
					function(err, result) {
						if (!err) {
							ol.output_logger("Inserted: " + input_message + " to the DB", "db.js");
							callback(true);
						}
						else {
							ol.output_logger("COULD NOT insert: " + input_message + " to the DB", "db.js");
							fivehundred_error();
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
							// Determine if the collection exist or not. Not very pretty though.
							if (docs.length > 0) {
								ol.output_logger("Found the " + dbCollection + "-collection", "db.js");
								callback(docs);
							}
							else {
								ol.output_logger("COULD NOT find the " + dbCollection +"-collection", "db.js");
								fivehundred_error();
								callback(false);
							}
						});
				}
				else {
					ol.output_logger("COULD NOT find the collection.", "db.js");
					fivehundred_error();
				}
			});
		}

		var updateCollection = function(dbCollection, id, JSONvalue, callback) {
			ol.output_logger("Called updateCollection", "db.js");

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
							if (!err) {
								ol.output_logger("Updated " + dbCollection +"-collection, where ID: " + id + " with JSON-values: " + JSONvalue, "db.js");
								callback(true);
							}
							else {
								ol.output_logger("COULD NOT update " + dbCollection +"-collection, where ID: " + id + " with JSON-values: " + JSONvalue, "db.js");
								fivehundred_error();
								callback(false);
							}
						});
				}
				else {
					fivehundred_error();
				}
			});
		}

		exports.insertTweet = insertTweet;
		exports.getCollection = getCollection;
		exports.updateCollection = updateCollection;
	}
	else {
		ol.output_logger("An error occured when connecting to the DB", "db.js");
		fivehundred_error();
	}
});

var mongo = require("mongodb");
var http = require("http");
var url = require("url");

var server = new mongo.Server("localhost", 27017);
var db = new mongo.Db("tdp013lab2", server);

// Exists so it's easy to turn on or off all the console logging
function output_logger(output_text) {
	var logger = true;
	if (logger) {
		console.log(output_text);
	}
}

function fivehundred_error(response) {
	response.writeHead(500, {"Content-Type": "text/html"});
	response.write("500 Internal Server Error <br />");
	response.end();
}

// The db connection will be always be open
db.open(function(err, db) {
	if (!err) {
		output_logger("DB connected");

		var insertTweet = function(input_message, callback) {
			db.collection("tweets", function(err, collection) {
				collection.insert(
					{
						message: input_message,
						flag: false
					},
					function(err, result) {
						if (!err) {
							output_logger("Inserted: " + input_message + " to the DB");
							callback(true);
						}
						else {
							output_logger("COULD NOT insert: " + input_message + " to the DB");
							fivehundred_error();
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
							// Determine if the collection exist or not. Not very pretty though.
							if (docs.length > 0) {
								output_logger("Found the " + dbCollection + "-collection");
								callback(docs);
							}
							else {
								output_logger("COULD NOT find the " + dbCollection +"-collection");
								fivehundred_error();
								callback(false);
							}
						});
				}
				else {
					output_logger("COULD NOT find the collection.");
					fivehundred_error();
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
							if (!err) {
								output_logger("Updated " + dbCollection +"-collection, where ID: " + id + " with JSON-values: " + JSONvalue);
								callback(true);
							}
							else {
								output_logger("COULD NOT update " + dbCollection +"-collection, where ID: " + id + " with JSON-values: " + JSONvalue);
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
		output_logger("An error occured when connecting to the DB");
		fivehundred_error();
	}
});

exports.output_logger = output_logger;

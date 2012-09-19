var mongo = require("mongodb");
var http = require("http");
var url = require("url");

var ol = require("./output_logger.js");

var server = new mongo.Server("localhost", 27017);
var db = new mongo.Db("tdp013lab2", server);

// The db connection will be always be open
db.open(function(err, db) {
	if (!err) {
		ol.output_logger("DB connected", "db.js");

		var insertTweet = function(response, input_message, callback) {
			db.collection("tweets", function(err, collection) {
				collection.insert(
					{
						message: input_message,
						flag: false
					},
					{
						safe: true
					},
					function(err, result) {
						if (!err) {
							ol.output_logger("Inserted: " + input_message + " to the DB", "db.js");
							// result contains everything that is inserted to DB.
							callback(true, result);
						}
						else {
							/*
							 * This is a 500 error and it will return an error if called.
							 * The error is called from requestHandlers.js because it recieves a 'false'
							 */ 
							ol.output_logger("COULD NOT insert: " + input_message + " to the DB", "db.js");
							callback(false);
						}
					});
			});
		}

		var getCollection = function(response, dbCollection, callback) {
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
								/*
								 * This is a 500 error and it will return an error if called.
								 * The error is called from requestHandlers.js because it recieves a 'false'
								 */ 
								ol.output_logger("COULD NOT find the " + dbCollection +"-collection", "db.js");
								callback(false);
							}
						});
				}
				else {
					/*
					 * This is a 500 error and it will return an error if called.
					 * The error is called from requestHandlers.js because it recieves a 'false'
					 */ 
					ol.output_logger("COULD NOT find the collection.", "db.js");
					callback(false);
				}
			});
		}

		var updateCollection = function(response, dbCollection, id, JSONvalue, callback) {
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
								/*
								 * This is a 500 error and it will return an error if called.
								 * The error is called from requestHandlers.js because it recieves a 'false'
								 */ 
								ol.output_logger("COULD NOT update " + dbCollection +"-collection, where ID: " + id + " with JSON-values: " + JSONvalue, "db.js");
								callback(false);
							}
						});
				}
				else {
					/*
					 * This is a 500 error and it will return an error if called.
					 * The error is called from requestHandlers.js because it recieves a 'false'
					 */ 
					callback(false);
				}
			});
		}

		exports.insertTweet = insertTweet;
		exports.getCollection = getCollection;
		exports.updateCollection = updateCollection;
	}
	else {
		ol.output_logger("An error occured when connecting to the DB", "db.js");
	}
});

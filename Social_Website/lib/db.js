/*
Template for functions:

 var testFunction = function(res, json_data, callback) {
 ol.logger("testFunction() called", "db.js");
 if (mongo_db._state == "connected") {
 }
 else
 ol.logger("ERROR: The DB-connection is not open!", "db.js");
 }
 */

var mongodb = require("mongodb");

var ol = require("./helpers/output_logger");

var mongo_server = new mongodb.Server("localhost", 27017, {auto_reconnect: true});
var mongo_db = new mongodb.Db("tdp013project", mongo_server);

// The DB-connection will always be open
mongo_db.open(function(err, db) {
	if (!err) {
		ol.logger("DB connection OPEN", "db.js");

		/*
		 * registerUser
		 */
		var registerUser = function(json_data, callback) {
			ol.logger("registerUser() called", "db.js");
			if (mongo_db._state == "connected") {
				mongo_db.collection("users", function(err, collection) {
					collection.insert(
						// Should replace this with own defined tables since I don't really need the password_repeat..
						json_data,
						{
							safe: true
						},
						function(err, res) {
							if (!err) {
								ol.logger("User added to DB", "db.js");
								ol.logger("Data added:", "db.js");
								ol.logger(json_data, "db.js");
								callback(true);
							}
							else {
								ol.logger("ERROR: User not added to DB!", "db.js");
								callback(false);
							}
						}
					)
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", "db.js");
		}
		/*
		 * registerUser
		 */

		/*
		 * getUser
		 */
		var getUser = function(json_data, callback) {
			ol.logger("getUser() called", "db.js");
			if (mongo_db._state == "connected") {
				if (json_data["_id"])
					json_data["_id"] = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["_id"]);

				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.findOne(
							json_data,
							function(err, docs) {
								if (!err) {
									ol.logger("Returned a user from getUser()", "db.js");
									callback(true, docs);
								}
								else {
									ol.logger("Error when fetching from getUser()", "db.js");
									callback(false, {"nothing": true});
								}
							}
						);
					}
					else {
						ol.logger(err);
						callback(false);
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", "db.js");
		}
		/*
		 * getUser()
		 */



		/*
		 * getUserFriends()
		 */
		var getUserFriends = function(json_data, callback) {
			ol.logger("getUserFriends() called", "db.js");
			if (mongo_db._state == "connected") {
				var userId = new mongodb.BSONPure.ObjectID.createFromHexString(json_data);

				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.findOne(
							{
								_id: userId
							},
							function(err, docs) {
								if (!err) {
									callback(true, docs["friends"]);
								}
							}
						);
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", "db.js");
		}
		/*
		 * getUserFriends()
		 */
		

		/*
		 * search()
		 */
		var search = function(json_data, callback) {
			ol.logger("search() called", "db.js");
			if (mongo_db._state == "connected") {
				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.find(
							{
								"email": json_data
							}
						).toArray(function(err, docs) {
							if (docs.length > 0) {
								callback(true, docs);
							}
							else
								callback(false);
						});
					}
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", "db.js");
		}
		/*
		 * search()
		 */

		/*
		 * addUserFriend()
		 */
		var addUserFriend = function(json_data, callback) {
			ol.logger("addUserFriend() called", "db.js");
			if (mongo_db._state == "connected") {
				var userId = new mongodb.BSONPure.ObjectID.createFromHexString(json_data["_id"]);

				mongo_db.collection("users", function(err, collection) {
					if (!err) {
						collection.update(
							{
								"_id": userId
							},
							{
								$push: { "friends": json_data["friendId"] }
							},
							{
								safe: true
							},
							function(err, res) {
								if (!err) {
									callback(true);
								}
								else {
									callback(false);
								}
							}
						)
					 }
				});
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", "db.js");
		}
		/*
		 * addUserFriend()
		 */

		/*
		 * addWallText()
		 */
		var addWallText = function(json_data, callback) {
			ol.logger("addWallText() called", "db.js");
			if (mongo_db._state == "connected") {
				
			}
			else
				ol.logger("ERROR: The DB-connection is not open!", "db.js");
		}
		/*
		 * addWallText()
		 */


	}
	else
		ol.logger("DB connection NOT OPEN", "db.js");

	exports.registerUser = registerUser;
	exports.getUser = getUser;
	exports.getUserFriends = getUserFriends;
	exports.search = search;
	exports.addUserFriend = addUserFriend;
});